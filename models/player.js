var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var numz = { type: Number, required: true, default: 0 };
var stringz = { type: String, required: true, default: ""};

// most of these will use numz object above...

var fieldNames = [
	"accountId",
	"zoneId",
	"y",
	"x",
	"z",
	"heading",
	"gender",
	"class",
	"level",
	"deity",
	"lastLogin",
	"timePlayed",
	"level2",
	"anon",
	"gm",
	"exp",
	"points",
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
	"zoneChangeCount",
	"toxicity",
	"hungerLevel",
	"thirstLevel",
	"pvpStatus",
	"showHelm",
	"groupAutoConsent",
	"raidAutoConsent",
	"guildAutoConsent",
	"restTimer",   // why is this capital in the SQL table script for PLAYER table?
	"airRemaining",
	"autoSplitEnabled", // autosplit or autoSplit  ...idk
	"lfp",
	"lfg",
	"xTargets",
	"firstLogon",
	"eLastInvSnapshot"
]

var schemaObj = {};

// populates all the fields with the numz obj (type: Num, req: true, defaults to zero)
fieldNames.map(function(field){
	schemaObj[field] = numz;
});

var fieldsStr = [
	"name",
	"lastName",
	"title",
	"suffix"
];

// populates the fields with stringz obj (type: String, required, defaults to empty string)
fieldsStr.map(function(field){
	schemaObj[field] = stringz;
});

// _id automatic for documents
var playerSchema = new Schema(schemaObj); // our plain schema obj needs to be passed into Schema constructor

module.exports = mongoose.model('Player', playerSchema);

