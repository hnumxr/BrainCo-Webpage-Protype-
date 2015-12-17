'use strict';

var express = require('express');

var app = express();
app.use( express.static( __dirname + '/public') );

var server = require('http').Server( app );

server.listen( 3000, function(){
  console.log('listening on *:3000');
} );

var io = require('socket.io')( server );

var capture = io.of( '/capture' );

var socketData = {};
var stats = {value: 0};

var dashboard = io.of( '/dashboard' );


capture.on('connection', function( socket ) {
  socket.on('client-data', function( data ) {
    console.log("This is a connection ----------");
    console.log( data );
    socketData[ socket.id ] = data;
    stats.value += data.value;
  } );

  socket.on('disconnect', function() {
    stats.value -= socketData[socket.id].value;
    delete socketData[ socket.id ];
  } );

  socket.on('sendBrainWaveData', function(data) {
    console.log('Sending the brainwave data::::');
    console.log(data);
    socketData[socket.id] = data;
    stats.value = data.value;
    dashboard.emit('stats-updated', stats);
  });
} );

dashboard.on( 'connection', function( socket ) {
  console.log('The dashboard has got the connection ^^^^^^^^^^');
  socket.emit( 'stats-updated', stats );
} );

