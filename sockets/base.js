var mongoUtil = require( '../modules/mongoUtil');
module.exports = function (io) {
    var db = mongoUtil.getDb();
    'use strict';
    io.on('connection', function (socket) {
        console.log('a user connected');

        //socket.broadcast.emit('user connected');

        socket.on('message', function (from, msg) {

            console.log('recieved message from', from, 'msg', JSON.stringify(msg));

            //console.log('broadcasting message');
            //console.log('payload is', msg);
            //
            //io.sockets.emit('broadcast', {
            //    payload: msg,
            //    source: from
            //});
            //console.log('broadcast complete');

            io.sockets.emit('msg_res', {
                payload: msg,
                source: from
            });
        });

        socket.on("listen-dumps", function (from, msg) {
            console.log("Llega el pedido listen-dumps");
            db.collection('raw_dump').aggregate(
                {
                    $match : {type : "request"}
                },
                {
                    $group : {_id : "$src", averageSignal: { $avg: "$signal" }, count : { $sum : 1 }}
                },function(err, items) {
                    console.log("Llega el pedido listen-dumps: ");
                    socket.emit("item-stored", items);
                });
            //db.collection('raw_dump').find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
            //    console.log("entro", cursor);
            //    cursor.intervalEach(300, function(err, item) { // intervalEach() is a duck-punched version of each() that waits N milliseconds between each iteration.
            //        if(item != null) {
            //            socket.emit("item-stored", item); // sends to clients subscribed to type "all"
            //        }
            //    });
            //});
        });


    });
};
/*
function readAndSend (socket, collection) {
    collection.find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
        cursor.intervalEach(300, function(err, item) { // intervalEach() is a duck-punched version of each() that waits N milliseconds between each iteration.
            if(item != null) {
                socket.emit("all", item); // sends to clients subscribed to type "all"
            }
        });
    });
    collection.find({"messagetype":"complex"}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
        cursor.intervalEach(900, function(err, item) {
            if(item != null) {
                socket.emit("complex", item); // sends to clients subscribe to type "complex"
            }
        });
    });
}*/
