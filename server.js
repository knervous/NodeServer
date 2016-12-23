var io = require('socket.io')(process.env.PORT || 5998);
var shortid = require('shortid');
var mongoose = require('mongoose');


var http = require('http');

function handleRequest(request, response){
    response.end('Path: '+request.url);
}

function lineDistance(vectorA, vectorB) {
    var xs = 0;
    var ys = 0;
    
    xs = vectorB.x - vectorA.x;
    xs = xs * xs;
    
    ys = vectorB.y - vectorA.y;
    ys = ys * ys;
    
    return Math.sqrt( xs + ys );
}


var server = http.createServer(handleRequest);

server.listen(5999, function(){
    
    console.log('Server listening on %s', 5999);
    
});

console.log('server started');


mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    
    
    console.log('connected to database');
    
});





var players = [];
var npcs = [];

var npcId = shortid.generate();
var npc = {
    id: npcId,
    type: 0,
    name: 'Test NPC',
    class: 'Warrior',
    currentHealth: 100,
    maxHealth: 100,
    currentMana: 0,
    maxMana: 0
};

npcs[npc.id] = npc;


var iFrequency = 5000;
var myInterval = 0;

function startLoop() {
    if(myInterval > 0) clearInterval(myInterval);
    myInterval = setInterval( WorldTick, iFrequency );
}

function WorldTick()
{
    console.log('world tick');
    return false;
}

startLoop();

io.on('connection', function(socket) {
    
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
    
    for(var npc_id in npcs){
            socket.emit('npcspawn', npcs[npc_id]);
    };
    
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


