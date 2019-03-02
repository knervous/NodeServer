var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// keeping lowercase because this is how you had it, should change to camelCase if won't conflict with entries in your db
// also consider using 'required'
var userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  created: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
