
const shortid = require('shortid');
const mongoose = require('mongoose');
const Npc = mongoose.model('Npc')
const Zone = mongoose.model('Zone')
const Vec2 = require('vec2')

var players = [];
var npcs = [];
var spawnPoints = [];
const iFrequency = 5000;
const pFrequency = 1500;
const fFrequency = 500;
var worldTickInterval = 0;
var frameInterval = 0;
var clientPositionInterval = 0;
var globalSocket


const start = (zoneId, port) => {
    const io = require('socket.io')(process.env.PORT || port);
    Zone.findOne({id: zoneId} , (err,zone) => {
        zone.spawns.forEach((spawn) => {
            spawn.id = shortid.generate();
            spawnPoints[spawn.id] = spawn;
        })
    for(let index in spawnPoints){
        let sp = spawnPoints[index]
        Npc.findOne({_id: sp.possible[0].id},(err,data) => {
            data['destination'] = sp.roaming.points[0] ? {x: sp.roaming.points[0].x, y: sp.roaming.points[0].y} : {x: sp.x, y: sp.y}
            data['position'] = {x: sp.x, y: sp.y}
            data['roaming'] = sp.roaming
            data['zoneId'] = index
            npcs[index] = data
        })
    }
    startLoop(io);
    handleClientServer(io);
    })
}

const handleClientServer = (io) =>
{
    io.on('connection', (socket) => {
        globalSocket = socket;
        var thisPlayerId = shortid.generate();
        var player = {
            id: thisPlayerId,
            destination: {
            x: 0, 
            y: 0
            },
            position: {
                x: 2700,
                y: -4700
            },
            lastMoveTime: 0
        };
        
        players[thisPlayerId] = player;
        
        console.log('client connected, broadcasting spawn, id: ', thisPlayerId);
        
        socket.broadcast.emit('spawn', { id: thisPlayerId });
        socket.broadcast.emit('requestPosition');
        
        for(var playerId in players){
            if(playerId == thisPlayerId)
                continue;
            socket.emit('spawn', players[playerId]);
            console.log('sending spawn to new player for id: ', playerId);
        };

        for(var npcId in npcs){
            socket.emit('npcSpawn', npcs[npcId])
            console.log('sending NPC spawn to new player for id: ', npcId);
        }
        
        socket.on('move', function(data){
            data.id = thisPlayerId;
            console.log('client moved to ', JSON.stringify(data));
            
            player.position.x = data.x;
            player.position.y = data.y;
            
            socket.broadcast.emit('move', data)
        });
        
        socket.on('updatePosition', function(data){
            console.log("update position: ", data);
            data.id = thisPlayerId;
            player.position.x = data.x;
            player.position.y = data.y;
            
            socket.broadcast.emit('updatePosition', data)
        });
        
        socket.on('disconnect',function(){
            console.log('client disconnected');
            
            delete players[thisPlayerId];
            
            socket.broadcast.emit('disconnected',{ id: thisPlayerId });
        });
    });
}

const lineDistance = (vectorA, vectorB) => {
    var xs = 0;
    var ys = 0;
    
    xs = vectorB.x - vectorA.x;
    xs = xs * xs;
    
    ys = vectorB.y - vectorA.y;
    ys = ys * ys;
    
    return Math.sqrt( xs + ys );
}

const startLoop = (io) => {
    if(worldTickInterval > 0) clearInterval(myInterval);
    worldTickInterval = setInterval( worldTick, iFrequency );
    frameInterval = setInterval( frameTick, fFrequency );
    clientPositionInterval = setInterval (()=>{updatePositionToClient(io)}, pFrequency)
}

const worldTick = () => {
    console.log('World Tick')
    for(let i_n in npcs){
        var n = npcs[i_n]
        //console.log('hit here')
       // console.log(`Position for ${n.name} -- ${JSON.stringify(n.position)} -- ${JSON.stringify(n.destination)}`)
        //console.log(`Current ${n.roaming.points[n.roaming.index].current}  --  Ticks ${n.roaming.points[n.roaming.index].ticks}`)
        if(n.roaming.points){
            let points = n.roaming.points;
            currentPathPoint = points[n.roaming.index]
            if(currentPathPoint.x == n.position.x
                && currentPathPoint.y == n.position.y){
                    if(currentPathPoint.current == currentPathPoint.ticks){
                        currentPathPoint.current = 0;
                        n.roaming.index = n.roaming.index + 1 == n.roaming.points.length ? 0 : n.roaming.index + 1
                        let newPathPoint = points[n.roaming.index]
                        n.destination = { x: newPathPoint.x, y: newPathPoint.y }
                    }else{
                        currentPathPoint.current++
                    }
                }
        }
    }
}

const frameTick = () => {
    for(let i_n in npcs){
        var n = npcs[i_n]
       // console.log(`${n.position.x} | ${n.destination.x}    ||   ${n.position.y} | ${n.destination.y}`)
        if(n.position.x !== n.destination.x || n.position.y !== n.destination.y){
            var cur = new Vec2(n.position.x, n.position.y)
            var end = new Vec2(n.destination.x, n.destination.y)
            var distance = cur.distance(end)
            n.position = cur.lerp(end, 5/distance, true)
            if(distance < 5){
                n.position = n.destination;
            }
        }
    }
}

const updatePositionToClient = (io) => {
    if(!globalSocket) return;
    //console.log('trying to update position to client')
   
    for(let i_n in npcs){
        var n = npcs[i_n]
        if(n.position.x !== n.destination.x || n.position.y !== n.destination.y){
          //  console.log('want to update')
            let data = {
                id: i_n,
                x: n.position.x,
                y: n.position.y
            }
            globalSocket.emit('move',data)
        }
    }
}

module.exports = { 
    start 
}