"use strict";

var $router1List = $('#router1List');
var $router2List = $('#router2List');
var $router3List = $('#router3List');
var $router4List = $('#router4List');

$(document).ready(function() {

    // Populate the device table on initial page load
    populateTable();

    setInterval(function() {
        populateTable();
    }, 10000);

});

function populateTable() {
    // jQuery AJAX call for JSON
    $.getJSON('/api/associatedDevices', function(data) {
        $router1List.find('tbody').fadeOut().empty();
        $router2List.find('tbody').fadeOut().empty();
        $router3List.find('tbody').fadeOut().empty();
        $router4List.find('tbody').fadeOut().empty();
        addRows(data);
    });
}

function addRows(data) {
    $.each(data, function(){
        if(this.router === "001") {
            $('#router1List').find('tbody').append(buildDeviceInfo(this));
        }
        else if (this.router == "002") {
            $('#router2List').find('tbody').append(buildDeviceInfo(this));
        }
        else if (this.router == "003") {
            $('#router3List').find('tbody').append(buildDeviceInfo(this));
        }
        else if (this.router == "004") {
            $('#router4List').find('tbody').append(buildDeviceInfo(this));
        }
    });
    $router1List.find('tbody').fadeIn();
    $router2List.find('tbody').fadeIn();
    $router3List.find('tbody').fadeIn();
    $router4List.find('tbody').fadeIn();

    $router1List.find('#devices').html($router1List.find('tbody').children().length + " devices");
    $router2List.find('#devices').html($router2List.find('tbody').children().length + " devices");
    $router3List.find('#devices').html($router3List.find('tbody').children().length + " devices");
    $router4List.find('#devices').html($router4List.find('tbody').children().length + " devices");

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