const shortid = require("shortid");
const mongoose = require("mongoose");
const Npc = mongoose.model("Npc");
const Zone = mongoose.model("Zone");
const Player = mongoose.model("Player");
const Inventory = mongoose.model("Inventory");
const Item = mongoose.model("Item");
const LiveItem = mongoose.model("LiveItem");
const Vec2 = require("vec2");

var players = [];
var npcs = [];
var spawnPoints = [];
const iFrequency = 5000;
const pFrequency = 1500;
const fFrequency = 500;
var worldTickInterval = 0;
var frameInterval = 0;
var clientPositionInterval = 0;
var globalSocket;

const start = (zoneId, port) => {
  const io = require("socket.io")(process.env.PORT || port);
  Zone.findOne({ id: zoneId }, (err, zone) => {
    zone.spawns.forEach(spawn => {
      spawn.id = shortid.generate();
      spawnPoints[spawn.id] = spawn;
    });
    for (let index in spawnPoints) {
      let sp = spawnPoints[index];
      Npc.findOne({ _id: sp.possible[0].id }, (err, data) => {
        data["destination"] = sp.roaming.points[0]
          ? { x: sp.roaming.points[0].x, y: sp.roaming.points[0].y }
          : { x: sp.x, y: sp.y };
        data["position"] = { x: sp.x, y: sp.y };
        data["roaming"] = sp.roaming;
        data["zoneId"] = index;
        npcs[index] = data;
      });
    }
    startLoop(io);
    handleClientServer(io);
  });
};

const handleClientServer = io => {
  io.on("connection", socket => {
    globalSocket = socket;
    var thisPlayerId = shortid.generate();
    var player = {
      id: thisPlayerId,
      destination: {
        x: 0,
        y: 0
      },
      position: {
        x: 0,
        y: 0
      },
      lastMoveTime: 0
    };

    players[thisPlayerId] = player;

    console.log("client connected, broadcasting spawn, id: ", thisPlayerId);

    socket.broadcast.emit("spawn", { id: thisPlayerId });
    socket.broadcast.emit("requestPosition");

    for (var playerId in players) {
      if (playerId == thisPlayerId) continue;
      socket.emit("spawn", players[playerId]);
      console.log("sending spawn to new player for id: ", playerId);
    }

    for (var npcId in npcs) {
      socket.emit("npcSpawn", npcs[npcId]);
      console.log("sending NPC spawn to new player for id: ", npcId);
    }

    socket.on("move", function(data) {
      let movingPlayer = players[thisPlayerId];
      movingPlayer.destination.x = data.x;
      movingPlayer.destination.y = data.y;
      console.dir(movingPlayer);
      console.log("client moved to ", JSON.stringify(data));
    });

    socket.on("updatePosition", function(data) {
      // console.log("update position: ", data);
      // data.id = thisPlayerId;
      // player.position.x = data.x;
      // player.position.y = data.y;
      // socket.broadcast.emit('updatePosition', data)
    });

    socket.on("disconnect", function() {
      console.log("client disconnected");

      delete players[thisPlayerId];

      socket.broadcast.emit("disconnected", { id: thisPlayerId });
    });

    socket.on("item_swap", data => {
      Player.findOne({ charId: data.char }, (err, res) => {
        let promises = [];

        let moverField, moveeField;
        var objId = require("mongoose").mongo.ObjectID;
        if (data.from.startsWith("Inventory_Slot")) {
          moverField = "invSlot" + data.from[data.from.length - 1];
        } else {
          switch (data.from) {
            case "Inventory_LeftEar":
              moverField = "leftEar";
              break;
            case "Inventory_Neck":
              moverField = "neck";
              break;
            case "Inventory_Face":
              moverField = "face";
              break;
            case "Inventory_Head":
              moverField = "head";
              break;
            case "Inventory_RightEar":
              moverField = "rightEar";
              break;
            case "Inventory_LeftFinger":
              moverField = "leftFinger";
              break;
            case "Inventory_LeftWrist":
              moverField = "leftWrist";
              break;
            case "Inventory_Arms":
              moverField = "arm";
              break;
            case "Inventory_Hands":
              moverField = "hands";
              break;
            case "Inventory_RightWrist":
              moverField = "rightWrist";
              break;
            case "Inventory_RightFinger":
              moverField = "rightFinger";
              break;
            case "Inventory_Shoulders":
              moverField = "shoulders";
              break;
            case "Inventory_Chest":
              moverField = "chest";
              break;
            case "Inventory_Back":
              moverField = "back";
              break;
            case "Inventory_Belt":
              moverField = "wait";
              break;
            case "Inventory_Legs":
              moverField = "legs";
              break;
            case "Inventory_Feet":
              moverField = "feet";
              break;
            case "Inventory_Primary":
              moverField = "primary";
              break;
            case "Inventory_Offhand":
              moverField = "secondary";
              break;
            case "Inventory_Ranged":
              moverField = "ranged";
              break;
            case "Inventory_Ammo":
              moverField = "ammo";
              break;
          }
        }
        const moverId = res.inventory[moverField];

        if (data.to.startsWith("Inventory_Slot")) {
          moveeField = "invSlot" + data.to[data.to.length - 1];
        } else {
          switch (data.to) {
            case "Inventory_LeftEar":
              moveeField = "leftEar";
              break;
            case "Inventory_Neck":
              moveeField = "neck";
              break;
            case "Inventory_Face":
              moveeField = "face";
              break;
            case "Inventory_Head":
              moveeField = "head";
              break;
            case "Inventory_RightEar":
              moveeField = "rightEar";
              break;
            case "Inventory_LeftFinger":
              moveeField = "leftFinger";
              break;
            case "Inventory_LeftWrist":
              moveeField = "leftWrist";
              break;
            case "Inventory_Arms":
              moveeField = "arm";
              break;
            case "Inventory_Hands":
              moveeField = "hands";
              break;
            case "Inventory_RightWrist":
              moveeField = "rightWrist";
              break;
            case "Inventory_RightFinger":
              moveeField = "rightFinger";
              break;
            case "Inventory_Shoulders":
              moveeField = "shoulders";
              break;
            case "Inventory_Chest":
              moveeField = "chest";
              break;
            case "Inventory_Back":
              moveeField = "back";
              break;
            case "Inventory_Belt":
              moveeField = "wait";
              break;
            case "Inventory_Legs":
              moveeField = "legs";
              break;
            case "Inventory_Feet":
              moveeField = "feet";
              break;
            case "Inventory_Primary":
              moveeField = "primary";
              break;
            case "Inventory_Offhand":
              moveeField = "secondary";
              break;
            case "Inventory_Ranged":
              moveeField = "ranged";
              break;
            case "Inventory_Ammo":
              moveeField = "ammo";
              break;
          }
        }
        const moveeId = res.inventory[moveeField];

        res.inventory[moverField] = moveeId;
        res.inventory[moveeField] = moverId;

        res.save(err => {
          if (!err) {
            socket.emit("itemSwapOkay", {
              from: data.from,
              to: data.to
            });
          } else {
            console.dir(err);
          }
        });
      });
    });
  });
};

const lineDistance = (vectorA, vectorB) => {
  var xs = 0;
  var ys = 0;

  xs = vectorB.x - vectorA.x;
  xs = xs * xs;

  ys = vectorB.y - vectorA.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
};

const startLoop = io => {
  if (worldTickInterval > 0) clearInterval(myInterval);
  worldTickInterval = setInterval(worldTick, iFrequency);
  frameInterval = setInterval(frameTick, fFrequency);
  clientPositionInterval = setInterval(() => {
    updatePositionToClient(io);
  }, pFrequency);
};

const worldTick = () => {
  console.log("World Tick");
  for (let i_n in npcs) {
    var n = npcs[i_n];
    if (n.roaming.points) {
      let points = n.roaming.points;
      currentPathPoint = points[n.roaming.index];
      if (
        currentPathPoint.x == n.position.x &&
        currentPathPoint.y == n.position.y
      ) {
        if (currentPathPoint.current == currentPathPoint.ticks) {
          currentPathPoint.current = 0;
          n.roaming.index =
            n.roaming.index + 1 == n.roaming.points.length
              ? 0
              : n.roaming.index + 1;
          let newPathPoint = points[n.roaming.index];
          n.destination = { x: newPathPoint.x, y: newPathPoint.y };
        } else {
          currentPathPoint.current++;
        }
      }
    }
  }
};

const frameTick = () => {
  for (let i_n in npcs) {
    var n = npcs[i_n];
    if (n.position.x !== n.destination.x || n.position.y !== n.destination.y) {
      var cur = new Vec2(n.position.x, n.position.y);
      var end = new Vec2(n.destination.x, n.destination.y);
      var distance = cur.distance(end);
      n.position = cur.lerp(end, 5 / distance, true);
      if (distance < 5) {
        n.position = n.destination;
      }
    }
  }
  for (let i_n in players) {
    var n = players[i_n];
    if (n.position.x !== n.destination.x || n.position.y !== n.destination.y) {
      var cur = new Vec2(n.position.x, n.position.y);
      var end = new Vec2(n.destination.x, n.destination.y);
      var distance = cur.distance(end);

      if (!(distance < 5)) {
        n.position = cur.lerp(end, 20 / distance, true);
      }
    }
  }
};

const updatePositionToClient = io => {
  if (!globalSocket) return;

  for (let i_n in npcs) {
    var n = npcs[i_n];
    if (n.position.x !== n.destination.x || n.position.y !== n.destination.y) {
      let data = {
        id: i_n,
        x: n.position.x,
        y: n.position.y,
        type: "npc"
      };
      globalSocket.emit("move", data);
    }
  }

  for (let i_n in players) {
    var n = players[i_n];
    if (n.position.x !== n.destination.x || n.position.y !== n.destination.y) {
      let data = {
        id: i_n,
        x: n.position.x,
        y: n.position.y,
        type: "player"
      };
      globalSocket.emit("move", data);
    }
  }
};

module.exports = {
  start
};
