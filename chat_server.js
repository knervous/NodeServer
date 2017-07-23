
const shortid = require('shortid');
const mongoose = require('mongoose');
const Npc = mongoose.model('Npc')
const Zone = mongoose.model('Zone')
const Player = mongoose.model('Player')
const Inventory = mongoose.model('Inventory')
const Item = mongoose.model('Item')
const LiveItem = mongoose.model('LiveItem')
const Vec2 = require('vec2')

var globalSocket

const start = (port) => {
    const io = require('socket.io')(process.env.PORT || port);
    handleChatServer(io);
}

const handleChatServer = (io) =>
{
    io.on('connection', (socket) => {
        globalSocket = socket;

        socket.on('message', async (data) => {
            console.dir(data)
            if(data.message.startsWith('#')){
                if(data.message.startsWith('#find')){
                    let searchTerm = data.message.split(' ')[1]
                    var q = Item.find({Name: new RegExp(searchTerm)}).limit(50);
                    q.exec((err, res) => {
                        let ar = []
                        res.forEach((item) => {
                            ar.push({name: item.Name, id: item.id})
                        })
                        console.dir(ar)
                        socket.emit('item_search_result', {ar});
                    });
                }else if(data.message.startsWith('#summon')){
                    let id = data.message.split(' ')[1]
                    Item.findOne({id: id}, (err,res)=>{
                        let newItem = new LiveItem(res._doc)
                        //console.dir(newItem)
                        let i = new mongoose.Types.ObjectId()
                        newItem._id = i
                        newItem.save((err) => {
                            Player.findOne({name: data.name}, (err,p) => {
                                p.inventory.invSlot1 = i
                                p.save((er) => {
                                    let pushInv = p.inventory._doc
                                    pushInv.invSlot1 = newItem
                                    socket.emit('summon_item',
                                    { item: 'Item Summoned: ' + res.Name,
                                      inventory: pushInv
                                    })
                                })
                            })
                        })
                    })
                      
                }
            }
            Player.findOne({name: data.name}, (err,res) => {
               // console.dir(res)
            });
        })
        
        socket.on('disconnect',function(){
            console.log('client disconnected');
        });
    });
}

module.exports = { 
    start 
}