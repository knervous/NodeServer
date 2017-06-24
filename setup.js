var mongoose = require('mongoose');
var db = require('./models/db.js');

var Npc = mongoose.model('Npc');
var Zone = mongoose.model('Zone');


var fireBeetle = new Npc()

console.log(fireBeetle)
fireBeetle.save((e) => {
    console.log(e)
})
var newZone = new Zone({
    id: 0,
    name: "qeynos2",
    fullName: "North Qeynos",
    spawns: [{}],
    npcs: [{}],
})

console.log(newZone)
newZone.save((e) => {
    console.log(e)
})