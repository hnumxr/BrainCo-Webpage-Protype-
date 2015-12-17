/**
 * Created by Rhea on 12/12/15.
 */
'use strict';

var express = require('express');
var app = express();
var net = require('net');
var http = require('http');



app.use('/', express.static('../app/'));
console.log('started the server');
app.use('/bower_components', express.static('../bower_components/'));

//==================================================

var server = http.createServer(app);

server.on('request', function(req, res) {
  req.on('data', function(chunck) {
    console.log('The data is :::'+chunck);
  }).on('end', function() {
    console.log('End!!!!');
  }).on('error', function(er) {
    console.log('Wrong!!!');
    console.log(er.message);
  });

})


server.listen(3000, function() {
  console.log('The is a 9000 listening');
});


//==================================================

/*app.get('/', function(req, res) {
  res.send('Hello World $$$$$');
});

var server = app.listen(9000, function(req, res) {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});*/



//==================================================
// TODO: Original version
/*var http = require('http').Server(app);

var http = require('http').createServer(app);
var io1 = require('socket.io')(http);


var socketData = {};
var stats = {value: 0};


io1.on('request', function(req, res) {
  var body = '';

  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    console.log('Get the data:');
    console.log(chunk);
    body += chunk;
  });

  req.on('end', function() {
    try {
      var data = JSON.parse(body);
    } catch(er) {
      res.statusCode = 400;
      return res.end('error: ' + er.meesage);
    }

    res.write(typeof data);
    res.write('\n');
    res.end();
  });

});

var explore = io1.of( '/explore' );



explore.on( 'connection', function( socket ) {
  console.log('The explore has got the connection ^^^^^^^^^^');

} );

http.listen(9000, function() {
  console.log('This is listening to 9000');
});

*/
//================================================================================================


/*var express = require('express');
var app = express();

app.use('/', express.static('../app/'));
console.log('started the server');
app.use('/bower_components', express.static('../bower_components/'));

//var http = require('http').Server(app);
var http2 = require('http');

//var server2 = http2.createServer();

var server2 = http2.Server(app);

server2.on('request', function(req, res) {
  var body = '';

  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    console.log('Get the data:');
    console.log(chunk);
    body += chunk;
  });

  req.on('end', function() {
    try {
      var data = JSON.parse(body);
    } catch(er) {
      res.statusCode = 400;
      return res.end('error: ' + er.meesage);
    }

    res.write(typeof data);
    res.write('\n');
    res.end();
  });
});

server2.listen(9000);*/
