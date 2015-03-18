"use strict"

$(document).ready(function() {
    var renderedMap = renderMap();

    var socket = io();

    setInterval(function(){
        socket.emit("listen-dumps");
    }, 1000);

    var logMaxReached = false;
    socket.on("item-stored", function(data){
        //console.log(JSON.parse(data)[0].src);
        //console.log(JSON.parse(data)[0].src.indexOf("6a:86"));

        //if (JSON.parse(data)[0].src.indexOf("6a:86") > 0){
            $("#recivedpackageInfo").prepend("<div class='packEntry'>"+data+"</div>");
            if (!logMaxReached){
                logMaxReached = ($("#recivedpackageInfo div.packEntry").length >35);
            } else {
                $("#recivedpackageInfo div.packEntry:last-child").remove();
            }
            drawPoints(renderedMap, JSON.parse(data));
     //   }

        //$("#recivedpackageInfo").prepend("<div class='packEntry'>"+data+"</div>");
        //if (!logMaxReached){
        //    logMaxReached = ($("#recivedpackageInfo div.packEntry").length >35);
        //} else {
        //    $("#recivedpackageInfo div.packEntry:last-child").remove();
        //}
        //drawPoints(renderedMap, JSON.parse(data));
    });

});

function renderMap() {
    var devicesData,
        canvas,
        heatmap,
        router_image;

    canvas = document.getElementById("canv");
    heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha: true});
    //var heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha:true, alphaRange: [1, 0]}); // inverse transparency
    //var heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha:true, alphaRange: [0, 0.05]}); // steep transparency
    //var heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha:true, gradientTexture:'deep-sea-gradient.png'});
    //var heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha:false, gradientTexture:'skyline-gradient.png'});
    //var heatmap = createWebGLHeatmap({width: 500, height: 500}); // statically sized heatmap
    document.body.appendChild(heatmap.canvas);



    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        var update = function () {
        //heatmap.addPoint(100, 100, 100, 10/255);
        //heatmap.adjustSize(); // can be commented out for statically sized heatmaps, resize clears the map
        heatmap.update(); // adds the buffered points
        heatmap.display(); // adds the buffered points
        heatmap.multiply(0.9995);
        heatmap.blur();
        heatmap.clamp(0.0, 1.0); // depending on usecase you might want to clamp it
        raf(update);
    }
    raf(update);

      canvas.onclick = function () {
        heatmap.clear();
    }


    $.getJSON('/api/devicelist', function (data) {
        drawPoints(heatmap, data);
    });

    return heatmap;
}

function drawPoints(heatmap, data) {
    //TODO: Determine the best values to show the heatmap properlly
    var center_x = heatmap.width / 2,
        center_y = heatmap.height / 2,
        max_radius = center_x > center_y ? center_y : center_x,
        max_ssi = -65,
        min_ssi = -40;
    /*    console.log(center_x);
     console.log(center_y);
     console.log(max_radius);*/
    $.each(data, function (index, value) {
        var avg_ssi;
        if (value.averageSignal){
            avg_ssi = value.averageSignal.toFixed(0) * -1;
        } else {
            avg_ssi = value.signal.toFixed(0) * -1;
        }

        //normalized_ssi = (avg_ssi + min_ssi) * (max_radius / -(max_ssi - min_ssi));,
        var distance = calculateDistance(avg_ssi),
            normalized_distance = distance * max_radius / 10;


        //console.log("normalized_distance: ", normalized_distance);
        heatmap.addPoint(center_x, center_y, normalized_distance, 0.1);
    });
}

