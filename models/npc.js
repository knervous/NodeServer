var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// all mongodb documents will have _id field, the type is an object called 'ObjectId'
var reqNumZero = { type: Number, required: true, default: 0 };

// NOTE: may need to change all id's to mongodb's ObjectId's to reference documents in other collections
// Making comment on each field that may later be changed to ObjectId rather than number with "id"

var npcSchema = new Schema({
  name: { type: String, required: true, default: "Placeholder000" },
  lastName: { type: String, default: null },
  texture: { type: String, default: null },
  textureId: { type: Number, default: -1 },
  level: reqNumZero,
  race: reqNumZero,
  class: reqNumZero,
  bodyType: reqNumZero,
  hp: reqNumZero,
  mana: reqNumZero,
  gender: reqNumZero,
  size: reqNumZero,
  hpRegenRate: reqNumZero,
  manaRegenRate: reqNumZero,
  lootTableId: reqNumZero, // id
  merchantId: reqNumZero, // id
  npcSpellsId: reqNumZero, // id
  npcFactionId: reqNumZero, // id
  minDmg: reqNumZero,
  maxDmg: reqNumZero,
  aggroRadius: { type: Number, required: true, default: 0 },
  dMeleeTexture1: reqNumZero,
  dMeleeTexture2: reqNumZero,
  primMeleeType: { type: Number, required: true, default: 28 },
  secMeleeType: { type: Number, required: true, default: 28 },
  rangedType: { type: Number, required: true, default: 7 },
  runSpeed: reqNumZero,
  mr: reqNumZero,
  cr: reqNumZero,
  dr: reqNumZero,
  fr: reqNumZero,
  pr: reqNumZero,
  seeInvis: reqNumZero,
  seeInvisUndead: reqNumZero,
  ac: reqNumZero,
  npcAggro: reqNumZero,
  attackSpeed: reqNumZero,
  attackDelay: { type: Number, required: true, default: 30 },
  str: { type: Number, required: true, default: 75 },
  sta: { type: Number, required: true, default: 75 },
  dex: { type: Number, required: true, default: 75 },
  agi: { type: Number, required: true, default: 75 },
  int: { type: Number, required: true, default: 80 },
  wis: { type: Number, required: true, default: 75 },
  cha: { type: Number, required: true, default: 75 },
  atk: reqNumZero,
  accuracy: reqNumZero,
  avoidance: reqNumZero,
  version: reqNumZero,
  maxLevel: reqNumZero,
  scaleRate: { type: Number, required: true, default: 100 },
  isQuest: reqNumZero,
  light: reqNumZero,
  roaming: { type: Object, required: false, default: [] },
  position: { type: Object, required: false, default: { x: 0, y: 0 } },
  destination: { type: Object, required: false, default: { x: 0, y: 0 } },
  zoneId: { type: String, required: false }
});

module.exports = mongoose.model("Npc", npcSchema);
