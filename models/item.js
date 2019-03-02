var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// all mongodb documents will have _id field, the type is an object called 'ObjectId'
var reqNumZero = { type: Number, required: true, default: 0 };
var str = { type: String, required: false, default: "NONE" };
// NOTE: may need to change all id's to mongodb's ObjectId's to reference documents in other collections
// Making comment on each field that may later be changed to ObjectId rather than number with "id"

//_id created automatically for each doc..
var itemSchema = new Schema({
  id: reqNumZero,
  Name: str,
  idfile: str,
  ac: reqNumZero,
  aagi: reqNumZero,
  acha: reqNumZero,
  adex: reqNumZero,
  aint: reqNumZero,
  asta: reqNumZero,
  astr: reqNumZero,
  awis: reqNumZero,
  bagsize: reqNumZero,
  bagslots: reqNumZero,
  bagtype: reqNumZero,
  bagwr: reqNumZero,
  book: reqNumZero,
  color: reqNumZero,
  classes: { type: Array, required: false, default: [] },
  races: { type: Array, required: false, default: [] },
  slots: { type: Array, required: false, default: [] },
  bagSlots: { type: Array, required: false, default: [] },
  combateffects: str,
  price: reqNumZero,
  damage: reqNumZero,
  delay: reqNumZero,
  clicktype: reqNumZero,
  clicklevel: reqNumZero,
  recastdelay: reqNumZero,
  recasttype: reqNumZero,
  proceffect: reqNumZero,
  proctype: reqNumZero,
  proclevel: reqNumZero,
  worneffect: reqNumZero,
  wornlevel: reqNumZero,
  maxcharges: reqNumZero,
  haste: reqNumZero,
  hp: reqNumZero,
  mana: reqNumZero,
  regen: reqNumZero,
  manaregen: reqNumZero,
  icon: reqNumZero,
  lore: str,
  magic: reqNumZero,
  nodrop: reqNumZero,
  norent: reqNumZero,
  range: reqNumZero,
  size: reqNumZero,
  weight: reqNumZero,
  cr: reqNumZero,
  dr: reqNumZero,
  fr: reqNumZero,
  mr: reqNumZero,
  pr: reqNumZero,
  questitemflag: reqNumZero,
  clickname: str,
  procname: str,
  wornname: str,
  backstabdmg: reqNumZero,
  itemtype: reqNumZero,
  material: reqNumZero
});

module.exports = mongoose.model("Item", itemSchema);
