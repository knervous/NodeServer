var Vec2 = require('vec2')


var v1 = new Vec2(0,0)
var v2 = new Vec2(500,-300)

console.log(v1.normalize(true))
console.log(v2.normalize(true))

var t = setInterval(()=>{
    var distance = v1.distance(v2)

    console.log(`distance: ${distance}`)
    console.log(`vector 1: ${v1}`)
    let moveDistance

    v1.lerp(v2, 5/distance)
    if(distance< 5){
        clearInterval(t)
    }
},333)