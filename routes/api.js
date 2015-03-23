var express = require('express');
var router = express.Router();
var mongoUtil = require( '../modules/mongoUtil');
var queueModule = require( '../modules/queueModule');

/*
 * POST to add raw dump.
 */
router.post('/adddump', function(req, res) {
    var db = mongoUtil.getDb();
    db.collection('raw_dump').insert(req.body, function(err, result){
        //console.log("result: ", JSON.stringify(result));
        queueModule.push(JSON.stringify(result));
        analizeDump(result[0]);
        res.sendStatus(200);
    });
});

/*
 * GET deviceList.
 */
router.get('/devicelist', function(req, res) {
    var db = mongoUtil.getDb();
    db.collection('raw_dump').aggregate(
        {
            $match : {type : "request"}
        },
        {
            $group : {_id : "$src", averageSignal: { $avg: "$signal" }, count : { $sum : 1 }}
    },function(err, items) {
        res.json(items);
    });
});


/*
 * GET device frames.
 */
router.get('/deviceframes/:mac', function(req, res) {

    var db = mongoUtil.getDb(),
        r = /([a-f0-9]{2})([a-f0-9]{2})/i,
        mac = req.params.mac;
    while (r.test(mac)) {
        mac = mac.replace(r, '$1' + ':' + '$2');
    }
    db.collection('raw_dump').aggregate(
        {
            $match : {type : "request", src : mac}
        },function(err, frames) {
            res.json(frames);
        });
});

// time
// src
// router
// signal

function analizeDump(dump){
    var TIME_LIMIT = 180, //seconds
        THRESHOLD = 10;

    var db = mongoUtil.getDb();

    db.collection('association').aggregate(
        {
            $match : {src : dump.src}
        },function(err, data) {
            analizeAssociatedDevice(data);

        });

    function analizeAssociatedDevice(data) {
        if (data.length === 0) {
            associateDump(dump);
        } else {
            var associated = data[0];
            if (associated.src === dump.src) {
                updateAssociated(associated, dump);
            } else {
                if (Math.abs(dump.signal - associated.signal) > 10) {
                    updateAssociated(associated, dump);
                }
            }
        }
    }

    function associateDump(dump) {
        var associated = {
            time : dump.time,
            src : dump.src,
            router : dump.router,
            signal : dump.signal
        };
        db.collection('association').insert(associated, function (err, result) {
            //console.log("result: ", JSON.stringify(result));
        });
    }

    function updateAssociated(associated, dump){
        associated.time = dump.time;
        associated.router = dump.router;
        associated.signal = dump.signal;
        associated.src = dump.src;
        db.collection('association').update({_id: associated._id}, associated, function (err, result) {

        });
    }
}


module.exports = router;


