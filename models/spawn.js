var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// all mongodb documents will have _id field, the type is an object called 'ObjectId'
var numz = { type: Number, required: true, default: 0};
var stringz = { type: String, required: true, default: ""};

// NOTE: may need to change all id's to mongodb's ObjectId's to reference documents in other collections
// Making comment on each field that may later be changed to ObjectId rather than number with "id"

//_id created automatically for each doc..
var spawnSchema = new Schema({
	name: stringz,
	spawnLimit: numz,
	dist: numz,
	maxX: numz,
	minX: numz,

	maxY: numz,
	minY: numz,

	delay: {type: Number, required: true, default: 45000},
	despawn: numz,
	despawnTimer: {type: Number, required: true, default: 100}	
});

module.exports = mongoose.model('Spawn', spawnSchema);
