var Queue = require('tiny-queue')
function QueueModule (){
    this._queue;
    if (this._queue === undefined)
        this._queue = new Queue();
}

// 'prototype' has improved performances
QueueModule.prototype.push = function(data) {
    this._queue.push(data);
};

QueueModule.prototype.shift = function() {
    return this._queue.shift();
};

QueueModule.prototype.getLength = function() {
    return this._queue.length;
};


module.exports = new QueueModule();