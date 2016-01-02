'use strict';

var express = require('express');
var fs = require('fs');

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

var fs = require('fs');



var i = 0;
for(var i=0; i < 200; i++) {
//while(1 === 1) {
  (function(i) {
    setTimeout(
      function(){
        fs.readFile('../backend/c.txt', 'utf8', function(err, data) {
          if(err) {
            return console.log(err);
          }
          var dataArr = data.split(' ');
          for(var j=0; j < 60; j++) {
            (function(j) {
              setTimeout(
                function(){
                    console.log(dataArr[j]);
                    stats.value = parseInt(dataArr[j]);
                    dashboard.emit('stats-updated', stats);
                }, (15 * j));
            })(j);
          }
        });
      }, (1000 * i));
  })(i);
}

dashboard.on( 'connection', function( socket ) {
  console.log('The dashboard has got the connection ^^^^^^^^^^');
  socket.emit( 'stats-updated', stats );
} );

