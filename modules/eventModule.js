var EventEmitter = require('events').EventEmitter;
var util = require('util');


var EventModule = function() {
    if (!(this instanceof EventModule)) {
        return new EventModule();
    }

    if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
    EventEmitter.call(this);
};

EventModule.prototype.__proto__ = EventEmitter.prototype;


util.inherits(EventModule, EventEmitter);

EventModule.prototype.collectionUpdated = function(collection) {
    //console.log(collection+'_updated emmited');
    this.emit(collection+'_updated');
};

EventModule.prototype.listenEvent = function(event, callback) {
    this.on(event, function(data){
        //console.log("handling ", event);
        callback(data);
    });
};

EventModule.prototype.queueDataPushed = function() {
    this.emit("queueDataPushed");
};

EventModule.prototype.onQueueDataPush = function(callback) {
    this.removeAllListeners("queueDataPushed");
    this.on("queueDataPushed", function(data){
        callback(data);
    });
};
EventModule.prototype.removeQueueListener = function() {
    this.removeListener("queueDataPushed", function(data){

    });
};


module.exports = new EventModule();
