var mongoUtil = require( '../modules/mongoUtil');
var queueModule = require( '../modules/queueModule');
var eventModule = require( '../modules/eventModule');
module.exports = function (io) {
    var db = mongoUtil.getDb();
    'use strict';
    io.on('connection', function (socket) {
        console.log('a user connected');

        //socket.broadcast.emit('user connected');

        socket.on('message', function (from, msg) {

            console.log('recieved message from', from, 'msg', JSON.stringify(msg));

            io.sockets.emit('msg_res', {
                payload: msg,
                source: from
            });
        });

        socket.on("listen-dumps", function (from, msg) {
            var i = 0,
                max = queueModule.getLength();
            for (; i < max; i += 1){
                socket.emit("item-stored", queueModule.shift());
            }
        });

        eventModule.listenEvent('association_updated', function(data){
            console.log("hey!!")
        });
    });
};


