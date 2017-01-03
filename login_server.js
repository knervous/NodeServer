var mongoose = require('mongoose');
var io = require('socket.io')(process.env.PORT || 7000);

var db = require('./models/db.js');
var User = mongoose.model('Users'); // if you have acccess to mongoose model you can grab models like this (db.js is what requires them)

io.on('connection', function(socket) {
    
    socket.emit('login_connected');
    var username = '';
    var password = '';
    console.log('user connected');
    
    socket.on('trylogin', function(data){
        username = data.username;
        password = data.password;
        console.log('incoming data: ', JSON.stringify(data));
        data.characters = {
            
            character_one: {
                empty: false,
                name: 'Aine',
                race: 'Barbarian',
                level: 54,
                zone: 'qeynos2'
            
        },
            character_two: {
                empty: true
            
        },
            character_three: {
                empty: true
            
        },
            character_four: {
                empty: true
            
        },
            character_five: {
                empty: true
            
        },
            character_six: {
                empty: true
            
        },
            character_seven: {
                empty: true
            
        },
            character_eight: {
                empty: true
            
        },
            
        };
        socket.emit('loginsuccess', data);
    });
    
    socket.on('disconnect',function(){
        console.log('user disconnected');
    });
});


/*
var loginData = {
    username: 'user123',
    password: 'password123',
    created: new Date()
};
var newUser = new User(loginData);
    //Call save to insert the chat
    newUser.save(function(err, savedUser) {
      console.log(savedUser);
});
*/
