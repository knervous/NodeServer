var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var defaultNum = { type: String, required: false, default: "" };

var fieldNames = [
  "primary",
  "secondary",
  "arm",
  "back",
  "chest",
  "leftEar",
  "rightEar",
  "face",
  "feet",
  "leftFinger",
  "rightFinger",
  "hands",
  "head",
  "ranged",
  "legs",
  "neck",
  "shoulders",
  "wait",
  "leftWrist",
  "rightWrist",
  "invSlot1",
  "invSlot2",
  "invSlot3",
  "invSlot4",
  "invSlot5",
  "invSlot6",
  "invSlot7",
  "invSlot8"
];

var schemaObj = {};

// populates all the fields with the numz obj (type: Num, req: true, defaults to zero)
fieldNames.map(function(field) {
  schemaObj[field] = defaultNum;
});

var inventorySchema = new Schema(schemaObj); // our plain schema obj needs to be passed into Schema constructor
var m = mongoose.model("Inventory", inventorySchema);

module.exports = {
  schema: inventorySchema,
  model: m
};
