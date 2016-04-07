/* This server streams SSE to itself so you can test your handling functions. 

Created By Fox. 
Load at http://localhost:4000/msg to see the data.
Console will just say data.

*/


var http = require('http');
var path = require('path');
var express = require("express");
var app = express();
var cp = require("child_process");
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

app.use(express.static(__dirname));

app.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

    var spw = cp.spawn('ping', ['-c', '100', '127.0.0.1']),
    str = "";

    spw.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        console.log("data");

        // Flush out line by line.
        var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                res.write('data: ' + lines[i] + "\n\n");
            }
        }
    });

    spw.on('close', function (code) {
        res.end(str);
    });

	spw.stderr.on('data', function (data) {
	        res.end('stderr: ' + data);
	    });
	});

app.listen(4000);
