var EventEmitter = require('events').EventEmitter;
var util = require('util');

var EventModule = function() {
    //this.init();
};

util.inherits(EventModule, EventEmitter);

EventModule.prototype.collectionUpdated = function(collection) {
    //console.log(collection+'_updated emmited');
    this.emit(collection+'_updated');
};

EventModule.prototype.listenEvent = function(event, callback) {
    //console.log("listening ", event);
    this.on(event, function(data){
        //console.log("handling ", event);
        callback(data);
    });
};


module.exports = new EventModule();
