var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inventory = require('./inventory')
var numz = { type: Number, required: false, default: 0 };
var stringz = { type: String, required: false, default: "" };
var datez = { type: Date, required: false, default: new Date() };


var fieldNames = [
	"zoneId",
	"y",
	"x",
	"z",
	"gender",
	"class",
    "race",
	"level",
	"deity",
	"anon",
	"gm",
	"exp",
	"curHp",
	"mana",
	"endurance",
	"intoxication",
	"str",
	"sta",
	"cha",
	"dex",
	"int",
	"agi",
	"wis",
	"hungerLevel",
	"thirstLevel",
	"pvpStatus",
	"showHelm",
	"airRemaining",
	"lfg",
]

var schemaObj = {};

// populates all the fields with the numz obj (type: Num, req: true, defaults to zero)
fieldNames.map(function(field){
	schemaObj[field] = numz;
});

var fieldDates = [
    
    "lastLogin",
	"timePlayed",
    "creationDate"
]

var fieldsStr = [
	"name",
	"lastName",
	"title",
    "accountId",
    "charId"
];

// populates the fields with stringz obj (type: String, required, defaults to empty string)
fieldsStr.map(function(field){
	schemaObj[field] = stringz;
});

fieldDates.map(function(field){
   schemaObj[field] = datez; 
});

schemaObj['inventory'] = {type: inventory.schema, required: true, default: new inventory.model()}

// _id automatic for documents
var playerSchema = new Schema(schemaObj); // our plain schema obj needs to be passed into Schema constructor

module.exports = mongoose.model('Player', playerSchema);

