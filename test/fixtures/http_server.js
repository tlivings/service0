'use strict';

var service0 = require('../../index'),
    http = require('http');

var server = http.createServer(function (req, res) {
    var client = service0.client();

    client.send('ipc://broker', { number : 9999 }, function (error, headers, body) {
        if (error || headers.error) {
            res.writeHead(500);
            res.end(error || headers.error);
            return;
        }

        res.writeHead(200);
        res.end('Result: '+body.result);
    });

//    var request = http.get('http://localhost:3001', function (response) {
//        var chunks = [];
//        response.on('data', function (chunk) {
//            chunks.push(chunk);
//        });
//
//        response.on('end', function () {
//            res.writeHead(200);
//            res.end('Result: '+Buffer.concat(chunks).toString());
//        });
//    });
//
//    request.end();
});

server.listen(3000, function () {
    console.log('Listening on port 3000');
});