"use strict"
const mongoose = require('mongoose');
const Zone = mongoose.model('Zone');

Zone.remove({},()=>{
    console.log('Removed all zones')
})

const Npcs = require('./npcs')

const northQeynos = new Zone({
    id: 0,
    name: "qeynos2",
    fullName: "North Qeynos",
    spawns: [
        { x: 0, y: 0,possible: [
                {
                    id: Npcs.fireBeetle._id,
                    chance: 100
                }
            ]
        },
        { x: 500, y: 1000,possible: [
                {
                    id: Npcs.fireBeetle._id,
                    chance: 100
                }
            ]
        },
        { x: 250, y: 100,possible: [
                {
                    id: Npcs.fireBeetle._id,
                    chance: 100
                }
            ]
        },

        ]
})

northQeynos.save()

