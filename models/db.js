// handle our connection to mongoose db
var mongoose = require("mongoose");
//var config = require('../../config.js');
var dbURI = "mongodb://127.0.0.1/test"; //config.MONGODB_URL;

mongoose.connect(dbURI);

// I use this instead of .once('open', ...) hopefully this doesn't matter?
mongoose.connection.on("connected", function(data) {
  console.log("Mongoose default connection open to " + dbURI);
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection disconnected through the app termination"
    );
    process.exit(0);
  });
});

// bring in models
require("./npc.js");
require("./zone.js");
require("./player.js");
require("./account.js");
require("./spawn.js");
require("./user.js");
require("./inventory.js");
require("./item.js");
require("./liveitem");

// (this was originally in your login_server.js file, moved it for better organization)
