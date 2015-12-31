/**
 * Created by Rhea on 12/28/15.
 */

var fs = require('fs');

fs.readFile('./testFile.txt', 'utf8', function(err, data) {
  if(err) {
    return console.log(err);
  }
  //console.log(data);
  var a = data.split(' ');
  var c = a.slice(1);
  fs.writeFile('./anotherFile.txt', c.join(' '), function() {
    console.log('Done with writing!');
  })
});

/*var net = require('net');
var server = net.createServer(function(socket) {
  console.log('server connected');
  socket.on('end', function() {
    console.log('server disconnected');
  });
  console.log('It is----');
  //console.log(c);
  //socket.write('hello\r\n');
  //socket.pipe(socket);
});

server.listen(8124, function() {
  console.log('server bound');
});*/


/*'use strict';

var net = require('net');

var HOST = '127.0.0.1';
var PORT = 3000;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

  // We have a connection - a socket object is assigned to the connection automatically
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

  // Add a 'data' event handler to this instance of socket
  sock.on('data', function(data) {

    console.log('DATA ' + sock.remoteAddress + ': ' + data);
    // Write the data back to the socket, the client will receive it as data from the server
    //sock.write('You said "' + data + '"');

  });

  // Add a 'close' event handler to this instance of socket
  sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);*/




