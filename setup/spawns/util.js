module.exports = {
  createRoaming: r => {
    let points = [];
    console.log(r);
    for (let p of r) {
      console.log(p);
      points.push({
        x: p[0],
        y: p[1],
        ticks: p[2],
        current: 0
      });
    }
    return {
      index: 0,
      points
    };
  },

  createPossible: p => {}
};
