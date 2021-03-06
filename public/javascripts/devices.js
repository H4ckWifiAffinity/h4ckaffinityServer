"use strict"

$(document).ready(function() {

    // Populate the device table on initial page load
        populateTable();

    // Username link click
    $('#deviceList table tbody').on('click', 'td a.link-show-device-info', showDeviceInfo);

});

function populateTable() {
    // jQuery AJAX call for JSON
    $.getJSON( '/api/devicelist', function( data ) {
        addRows(data);
    });
}

function addRows(data){
    var tableContent = '';
    $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="link-show-device-info" rel="' + this._id + '">' + this._id + '</a></td>';
        tableContent += '<td>' + this.averageSignal.toFixed(0) + '</td>';
        tableContent += '<td>' + calculateDistance(this.averageSignal).toFixed(0) + '</td>';
        tableContent += '<td>' + this.count + '</td>';
        tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#deviceList table tbody').html(tableContent);
}

function showDeviceInfo(e) {
    e.stopPropagation();
    var deviceMacAddress = $(this).attr('rel').replace(/:/g,'');
    var tableContent = '';

    $.ajax({
        type: 'GET',
        url: '/api/deviceframes/'+deviceMacAddress,
        dataType: 'JSON'
    }).done(function( data ) {

        // Check for a successful (blank) response
        if (data.msg !== '') {
            $.each(data, function(){
                tableContent += '<tr>';
                tableContent += '<td>' + this.type + '</td>';
                tableContent += '<td>' + this.time + '</td>';
                tableContent += '<td>' + this.signal + '</td>';
                tableContent += '<td>' + calculateDistance(this.signal, this.freq).toFixed(0) + '</td>';
                tableContent += '<td>' + this.noise + '</td>';
                tableContent += '<td>' + this.bssid + '</td>';
                tableContent += '<td>' + this.dst + '</td>';
                tableContent += '<td>' + this.src + '</td>';
                tableContent += '<td>' + this.freq + '</td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#deviceFrameList table tbody').html(tableContent);
        }
        else {
            console.error('Error: ' + data.msg);
        }
   });
}

