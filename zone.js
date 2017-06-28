
const shortid = require('shortid');
const mongoose = require('mongoose');
const Npc = mongoose.model('Npc')
const Zone = mongoose.model('Zone')

var players = [];
var npcs = [];
var spawnPoints = [];
const iFrequency = 5000;
var myInterval = 0;

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
            data['x'] = sp.x
            data['y'] = sp.y
            npcs[index] = data
           // console.log(`here ${npcs[index]}`)
            console.log(`data: ${data}`)
        })
    }
    startLoop();
    handleClientServer(io);
    })
}

const handleClientServer = (io) =>
{
    io.on('connection', (socket) => {
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

const startLoop = () => {
    if(myInterval > 0) clearInterval(myInterval);
    myInterval = setInterval( worldTick, iFrequency );
}

const worldTick = () => {
    console.log('World Tick')
    return false;
}

module.exports = { 
    start 
}