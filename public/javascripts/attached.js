"use strict";

$(document).ready(function() {

    // Populate the device table on initial page load
    populateTable();


});

function populateTable() {
    // jQuery AJAX call for JSON
    $.getJSON( '/api/associatedDevices', function( data ) {
        addRows(data);
    });
}

function addRows(data){
    var tableRouter1 = '';
    var tableRouter2 = '';
    $.each(data, function(){
        if(this.router === "001") {
            tableRouter1 += '<tr>';
            tableRouter1 += '<td>' + this.router;
            tableRouter1 += '<td>' + this.time;
            tableRouter1 += '<td>' + this.src;
            tableRouter1 += '<td>' + this.signal;
            tableRouter1 += '</tr>';
        }
        else if (this.router == "luis") {
            tableRouter2 += '<tr>';
            tableRouter2 += '<td>' + this.router;
            tableRouter2 += '<td>' + this.time;
            tableRouter2 += '<td>' + this.src;
            tableRouter2 += '<td data=' + -this.signal + '>' + this.signal;
            tableRouter2 += '</tr>';
        }
    });

    // Inject the whole content string into our existing HTML table
    $('#router1List table tbody').html(tableRouter1);
    $('#router2List table tbody').html(tableRouter2);

}