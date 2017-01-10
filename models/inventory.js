var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var defaultNum = { type: Number, required: true, default: 0 };

var fieldNames = [
    "charID",
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
]

var schemaObj = {};

// populates all the fields with the numz obj (type: Num, req: true, defaults to zero)
fieldNames.map(function(field){
	schemaObj[field] = defaultNum;
});

var inventorySchema = new Schema(schemaObj); // our plain schema obj needs to be passed into Schema constructor

module.exports = mongoose.model('Inventory', inventorySchema);
