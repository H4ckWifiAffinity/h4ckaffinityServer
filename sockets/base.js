module.exports = function (io) {
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
    });
};