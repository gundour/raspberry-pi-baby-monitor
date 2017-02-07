var express = require('express');


var STREAM_SECRET = process.argv[2],
	STREAM_PORT = process.argv[3] || 8082,
	WEBSOCKET_PORT = process.argv[4] || 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320,
	height = 240;

// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
			this.clients[i].send(data, opts);
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};
/* Starting ffmpeg server */
var exec = require('child_process').exec;

var ffmpeg = 'ffmpeg -s 640x480 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 http://127.0.0.1:8082';


/* http server */
var app = express();

app.post('/', function(req, res) {
	console.log(req.method);
	res.connection.setTimeout(0);
	width = 640;
	height = 480;
	console.log(
		'Stream Connected: ' + req.socket.remoteAddress + 
		':' + req.socket.remotePort + ' size: ' + width + 'x' + height
	);
	req.on('data', function(data){
		socketServer.broadcast(data, {binary:true});
	});
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/jsmpg.js', function(req, res) {
	res.sendFile(__dirname + '/public/jsmpg.js');
});

app.listen(STREAM_PORT, function() {
	console.log('server is running on port : ' + STREAM_PORT);

	exec(ffmpeg, function(error, stdout, stderr) {
		console.log('ffmpeg is running.......');
		console.log('stdout: ' + stdout);
		if (error !== null) {
		    console.log('exec error: ' + error);
		}
	});
});