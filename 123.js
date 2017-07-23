var db = require('./models/db.js');
const mongoose = require('mongoose');

const Item = mongoose.model('Item')
const LiveItem = mongoose.model('LiveItem')


Item.findOne({id: 4164}, (err,res)=>{
    if(err) return
    //console.dir(res._doc)
    let newItem = new LiveItem(res._doc)
    //console.dir(newItem)
    newItem._id = new mongoose.Types.ObjectId()
    newItem.save((err) => {
        console.log(err)
    })
})