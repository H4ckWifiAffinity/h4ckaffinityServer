"use strict"

$(document).ready(function() {
    var renderedMaps = [];
    var routers = [];
    for (var i = 0; i < 4; i+=1){
        renderedMaps[i] = renderMap('canv'+(i+1));
    }

    var socket = io();

    socket.emit("listen-dumps");


    var logMaxReached = false;
    socket.on("item-stored", function(array){

        //$("#recivedpackageInfo").prepend("<div class='packEntry'>"+data+"</div>");
        //if (!logMaxReached){
        //    logMaxReached = ($("#recivedpackageInfo div.packEntry").length >35);
        //} else {
        //    $("#recivedpackageInfo div.packEntry:last-child").remove();
        //}
        var data = JSON.parse(array)[0];
        //console.log(data);
        var index = routers.indexOf(data.router);
        if (index < 0){
            routers.push(data.router);
            index = routers.indexOf(data.router);

            $($("h2").get(index)).append(": "+data.router);
        }

        //console.log("index ",index);
        //console.log("data.router ",data.router);
        drawPoints(renderedMaps[index], data);

    });

});

function renderMap(selector) {
    var canvas,
        heatmap;

    canvas = document.getElementById(selector);
    heatmap = createWebGLHeatmap({canvas: canvas, intensityToAlpha: true});

    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var update = function () {
        heatmap.update(); // adds the buffered points
        heatmap.display(); // adds the buffered points
        heatmap.multiply(0.995);
        heatmap.blur();
        heatmap.clamp(0.0, 1.0); // depending on usecase you might want to clamp it
        raf(update);
    }
    raf(update);
    canvas.onclick = function () {
        heatmap.clear();
    }

    //$.getJSON('/api/devicelist', function (data) {
    //    drawPoints(heatmap, data);
    //});

    return heatmap;
}

function drawPoints(heatmap, data) {
    //TODO: Determine the best values to show the heatmap properlly
    var center_x = heatmap.width / 2,
        center_y = heatmap.height / 2,
        max_radius = center_x > center_y ? center_y : center_x,
        max_ssi = -85,
        min_ssi = -20;


    var avg_ssi = data.signal * -1;

    //normalized_ssi = (avg_ssi + min_ssi) * (max_radius / -(max_ssi - min_ssi));,
    var distance = calculateDistance(avg_ssi),
        normalized_distance = distance * max_radius / 50;

    console.log("normalized_distance: ", normalized_distance);
    heatmap.addPoint(center_x, center_y, normalized_distance, 0.1);

}

