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
        console.log("result: ", JSON.stringify(result));
        queueModule.push(JSON.stringify(result));
        analizeDump(result);
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

/*


{ "_id" : ObjectId("5506e5be21f4ba251fab7036"),
 "type" : "request",
  "time" : "15:16:22.114970",
   "signal" : -54,
    "noise" : -100,
   "bssid" : "Broadcast",
    "dst" : "Broadcast",
     "src" : "00:26:ab:f1:da:22",
      "freq" : 2412 }




    */

// time
// src
// router
// signal

function analizeDump(dump){
    var TIME_LIMIT = 180, //seconds
        H_MAX = -40, //Histeresis max
        H_MIN = -60;

    var db = mongoUtil.getDb();

    db.collection('association').aggregate(
        {
            $match : {src : dump.src}
        },function(err, data) {
            analizeAssociatedDevice(data);

        });

    function analizeAssociatedDevice(associated){
        if (!associated){
            saveDump(dump);
        } else {
            if (dump.signal < H_MIN || dump.time > TIME_LIMIT || dump.src === associated.src){
                associated.time = dump.time;
                associated.router = dump.router;
                associated.signal = dump.signal;
                associated.src = dump.src;
                updateAssociated(associated);
            } else if (dump.src != associated.src && associated.signal > H_MAX && dump.signal < associated.signal){
                    associated.time = dump.time;
                    associated.router = dump.router;
                    associated.signal = dump.signal;
                    associated.src = dump.src;
                    updateAssociated(associated);
                }

        }
    }
}
function saveDump(dump) {
    var db = mongoUtil.getDb();
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

function updateAssociated(associated){
    var db = mongoUtil.getDb();
    db.collection('association').update( { "_id":  associated._id},
        associated,
        { upsert: false } );
}

module.exports = router;


