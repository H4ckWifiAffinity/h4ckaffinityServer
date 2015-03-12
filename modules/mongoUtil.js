// Database
var mongo = require('mongoskin');

var _db;

module.exports = {
    connectToServer: function( ) {
        _db = mongo.db("mongodb://localhost:27017/h4ckffinity", {native_parser:true});
    },
    getDb: function() {
        return _db;
    }
};
