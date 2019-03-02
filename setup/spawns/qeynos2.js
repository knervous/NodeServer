const util = require("./util");

module.exports = Npcs => {
  return [
    {
      x: 0,
      y: 0,
      possible: [
        {
          id: Npcs.fireBeetle._id,
          chance: 100
        }
      ],
      roaming: util.createRoaming([[0, 0, 3], [250, 100, 3], [50, -100, 3]])
    },
    {
      x: 500,
      y: 1000,
      possible: [
        {
          id: Npcs.fireBeetle._id,
          chance: 100
        }
      ],
      roaming: util.createRoaming([[0, 0, 4], [250, 100, 5], [50, -100, 6]])
    },
    {
      x: 250,
      y: 100,
      possible: [
        {
          id: Npcs.fireBeetle._id,
          chance: 100
        }
      ],
      roaming: util.createRoaming([[0, 0, 3], [250, 100, 2], [50, -100, 1]])
    }
  ];
};
