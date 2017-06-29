"use strict"
const mongoose = require('mongoose');
const Zone = mongoose.model('Zone');

Zone.remove({},()=>{
    console.log('Removed all zones')
})

const Npcs = require('./npcs')

const qeynos2 = require('./spawns/qeynos2')

const northQeynos = new Zone({
    id: 0,
    name: "qeynos2",
    fullName: "North Qeynos",
    spawns: qeynos2(Npcs)
})

northQeynos.save()

