var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// all mongodb documents will have _id field, the type is an object called 'ObjectId'
var reqNumZero = { type: Number, required: true, default: 0 };

// NOTE: may need to change all id's to mongodb's ObjectId's to reference documents in other collections
// Making comment on each field that may later be changed to ObjectId rather than number with "id"

//_id created automatically for each doc..
var accountSchema = new Schema({
  name: { type: String, required: true, default: "" },
  //charName: {type: String, required: true, default: ""},
  sharedPlat: reqNumZero,
  password: { type: String, required: true, default: "" },
  status: reqNumZero,
  lsAccountId: { type: String, default: 0 }, // unsure about this behavior, will it always appear in doc and be null if we dont set it?
  gmSpeed: reqNumZero,
  timeCreation: { type: Date, required: true, default: new Date() }
});

module.exports = mongoose.model("Account", accountSchema);
