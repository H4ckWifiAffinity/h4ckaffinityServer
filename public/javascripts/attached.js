"use strict";

$(document).ready(function() {

    // Populate the device table on initial page load
    populateTable();

    setInterval(function(){
        populateTable();
    }, 10000);

});

function populateTable() {
    // jQuery AJAX call for JSON
    $.getJSON( '/api/associatedDevices', function( data ) {
        $('#router1List').find('tbody').empty();
        $('#router2List').find('tbody').empty();
        addRows(data);
    });
}

function addRows(data){
    $.each(data, function(){
        if(this.router === "001") {
            $('#router1List').find('tbody').append(buildDeviceInfo(this));
        }
        else if (this.router == "luis") {
            $('#router2List').find('tbody').append(buildDeviceInfo(this));
        }
    });

}

function buildDeviceInfo(device) {
    var color = 100 + device.signal;
    var tableRouter = '';
    tableRouter += '<tr>';
    tableRouter += '<td class="time">';
    tableRouter += getTimeFromTimestamp(device.time);
    tableRouter += '</td>';
    tableRouter += '<td class="mac">';
    tableRouter += device.src;
    tableRouter += '</td>';
    tableRouter += '<td style="background-color: hsl(0,'+color+'%,75%)">';
    tableRouter += device.signal;
    tableRouter += '</td>';
    tableRouter += '</tr>';
    return tableRouter;
}

function getTimeFromTimestamp(timestamp) {
    var date = new Date(timestamp*1000);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    var formattedTime = hours + ':' + minutes.substr(minutes.length-2);

    return formattedTime;
}