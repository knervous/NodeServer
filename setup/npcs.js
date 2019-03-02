"use strict";
var mongoose = require("mongoose");
var Npc = mongoose.model("Npc");

Npc.remove({}, (a, b) => {
  console.log("Removed all NPCs");
});

const fireBeetle = new Npc({
  name: "A Fire Beetle",
  texture: "Textures/NPC Models/Fire Beetle/Fire Beetle"
});
fireBeetle.save();

module.exports = {
  fireBeetle
};
