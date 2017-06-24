var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// all mongodb documents will have _id field, the type is an object called 'ObjectId'
var reqNumZero = { type: Number, required: true, default: 0};
var reqString = { type: String, required: true, default: ''}

// NOTE: may need to change all id's to mongodb's ObjectId's to reference documents in other collections
// Making comment on each field that may later be changed to ObjectId rather than number with "id"

var zoneSchema = new Schema({
	id: reqNumZero,
	name: reqString,
	fullName: reqString,
	spawns: { type: Array, required: true, default: [] },
	npcs: { type: Array, required: true, default: [] }
});

module.exports = mongoose.model('Zone', zoneSchema);
