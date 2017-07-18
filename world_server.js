var mongoose = require('mongoose');
var io = require('socket.io')(process.env.PORT || 7000);
var uuid = require('node-uuid');

var db = require('./models/db.js');
var Account = mongoose.model('Account'); // if you have acccess to mongoose model you can grab models like this (db.js is what requires them)
var Player = mongoose.model('Player');
var Inventory = mongoose.model('Inventory');
var LiveItem = mongoose.model('LiveItem');

const bootZone = require('./zone')
var activeZones = []

bootZone.start(0,5998)

io.on('connection', function(socket) {
    socket.emit('login_connected');
    console.log('user connected');
    var accountId = '';
    
    socket.on('trylogin', function(data){
        Account.findOne({ name: data.username }, function(err, userExists){
           if(err) return console.error(err);
            if(userExists == null && data.username.length > 0 && data.password.length > 0)
                {
                    var newAccount = new Account({
                        name: data.username,
                        password: data.password,
                        lsAccountId: uuid.v4(),
                        sharedPlat: 1,
                        status: 0,
                        gmSpeed: 0,
                    });
                    
                    newAccount.save(function(err, savedAccount) {
                    if (err) return console.error(err);
                    console.log(savedAccount);
                        socket.emit('account_created');
                    });
                }
            if(userExists != null)
                {
                    if(data.password == userExists.password)
                        {
                            console.log('password okay', userExists.password);
                            data.account = userExists;
                            let inventories = []
                            accountId = userExists.lsAccountId;
                            Player.find({ accountId: userExists.lsAccountId}, function(err, chars){
                                if(err) return console.error(err);
                                else{
                                    data.characters = chars;
                                    let promises = []
                                    let inventories = []
                                    chars.forEach((char)=>{
                                        let inv = new Object(char.inventory._doc);
                                        var objId = require('mongoose').mongo.ObjectID
                                        for(let name in inv){
                                            let val = inv[name];
                                            if(val !== undefined && val.length > 0 && val !== '_id'){
                                                promises.push(
                                                    LiveItem.findOne({_id: new objId(val)}, (err,res) => {
                                                        if(res){
                                                            inv[name] = res._doc;
                                                        }
                                                    }).exec()
                                                )
                                            }
                                        }
                                        inventories.push(inv)
                                    })  
                                    
                                    Promise.all(promises).then(()=>{
                                        data.inventories = inventories
                                        socket.emit('login_success', data);
                                    })
                                }
                            });
                        }
                    else if(data.password != userExists.password)
                    {
                        console.log('password failed');
                        socket.emit('password_failed');
                        
                    }
                }
        });
        
    });
    
    socket.on('check_name',function(data){
        console.log(data);
        Player.findOne({ name: data.name }, function(err, name_found){
                if(err) return console.error(err);
                data.exists = Boolean(name_found);
                socket.emit('name_check', data);
                console.log('returning value: ', Boolean(name_found));
                 
               });
    });

    socket.on('get_inventory', (inv) => {
    //let inv = new Object(res.inventory._doc);
        var promises = []
        var objId = require('mongoose').mongo.ObjectID
        for(let name in inv){
            let val = inv[name];
            if(val !== undefined && val.length > 0 && val !== '_id'){
                promises.push(
                    liveItem.findOne({_id: new objId(val)}, (err,res) => {
                        if(res){
                            inv[name] = res._doc;
                        }
                    }).exec()
                )
            }
        }
        Promise.all(promises).then(()=>{
            console.log('resolved promises')
            console.log(inv)
        })
       
    })
    
    socket.on('create_new_character',function(charData){
        console.log(charData);
       var newChar = new Player({
           x: charData.x,
           y: charData.y,
           z: charData.z,
           zoneId: charData.zoneId,
           gender: charData.gender,
           class: charData.class,
           race: charData.race,
           level: charData.level,
           anon: charData.anon,
           gm: charData.gm,
           exp: charData.exp,
           curHp: charData.curHp,
           mana: charData.mana,
           endurance: charData.endurance,
           intoxication: charData.intoxication,
           str: charData.str,
           sta: charData.sta,
           dex: charData.dex,
           agi: charData.agi,
           wis: charData.wis,
           int: charData.int,
           cha: charData.cha,
           name: charData.name,
           accountId: accountId,
           charId: uuid.v4()
       });
        //console.log(newChar);
        newChar.save(function(err,data){
            if (err) return console.error(err);
            socket.emit('character_created');
        });
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
