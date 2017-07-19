var mysql = require('mysql');
var db = require('../../models/db.js');
var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var fs = require('fs')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "eqemu",
  database: "peq"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


var count = 0

const bulkQuery = (limit) => {
    con.query(`SELECT * FROM items limit ${limit}` , (err, res, fields) => {
    fs.writeFileSync(`chunks/db_items${count}.json`, '');
    var logStream = fs.createWriteStream(`chunks/db_items${count}.json`, {'flags': 'a'});
    logStream.write('[')
    for(let x = 0; x<res.length; x++){
       let item = res[x];
       item.races = getRaces(item.races)
       item.classes = getClasses(item.classes)
       item.slots = getSlots(item.slots)
       let i = new Item(item);
       logStream.write(JSON.stringify(i))
       if(x % 500 === 0 && x !== 0){
            count++
            logStream.end(']')
            fs.writeFileSync(`chunks/db_items${count}.json`, '');
            logStream = fs.createWriteStream(`chunks/db_items${count}.json`, {'flags': 'a'});
            logStream.write('[')
            continue;
        }
       logStream.write((x === (res.length - 1)) ? '' : ',');
    }
    logStream.end(']')
})
}

for(x = 0; x < 95000; x += 10000){
    bulkQuery(`${x}, 10000`)
}




const getRaces = (val) => {
    var ar = [];
    var race_values = {
        "Drakkin": 32768, "Froglok": 16384,"Vah Shir": 8192,"Iksar": 4096,
        "Gnome": 2048, "Halfling": 1024,"Ogre": 512,"Troll": 256,"Dwarf": 128,
        "Half Elf": 64, "Dark Elf": 32, "High Elf": 16, "Wood Elf": 8, "Erudite": 4,
        "Barbarian": 2, "Human": 1, 
    }
    for (var key in race_values) {
        let n = race_values[key]
        if(val>=n){
            ar.push(key)
            val-=n
        }
    }
    return ar
}

const getClasses = (val) => {
    var ar = [];
    var class_values = {
        "Berserker": 32768, "Beastlord": 16384, "Enchanter": 8192,"Magician": 4096,
        "Wizard": 2048, "Necromancer": 1024, "Shaman": 512,"Rogue": 256, "Bard": 128, 
        "Monk": 64,"Druid": 32, "Shadow Knight": 16, "Ranger": 8, "Paladin": 4,
        "Cleric": 2, "Warrior": 1,
    }
    for (var key in class_values) {
        let n = class_values[key]
        if(val>=n){
            ar.push(key)
            val-=n
        }
    }
    return ar
}

const getSlots = (val) => {
    var ar = [];
    var slot_values = {
        "Powersource": 4194304, "Ammo": 2097152, "Waist": 1048576, "Feet": 524288, "Legs": 262144,
        "Chest": 131072, "Rings": 98304, "Secondary": 16384, "Primary": 8192, "Hands": 4096, "Range": 2048, 
         "Bracers": 1536, "Back": 256, "Arms": 128, "Shoulders": 64,"Neck": 32, "Ears": 18, 
         "Face": 8, "Head": 4,"Charm": 1,
    }
    for (var key in slot_values) {
        let n = slot_values[key]
        if(val>=n){
            ar.push(key)
            val-=n
        }
    }
    return ar
}