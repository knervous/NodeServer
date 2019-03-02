var db = require("../../models/db.js");
var mongoose = require("mongoose");
var Item = mongoose.model("Item");
var fs = require("fs");

Item.remove({}, () => {
  console.log("Removed all item");
  fs.readdir(__dirname + "/chunks", async (err, filenames) => {
    for (let filename of filenames) {
      console.dir("inserting 500");
      let content = fs.readFileSync(__dirname + "/chunks/" + filename);
      let items = JSON.parse(content);
      await Item.insertMany(items);
      console.dir("done");
    }
  });
});
