'use strict';

var service0 = require('../../index'),
    http = require('http');

var server = http.createServer(function (req, res) {
    var client = service0.client();

    client.send('ipc://broker', { number: 300 }, function (error, body) {
        if (error) {
            res.writeHead(500);
            res.end(error || headers.error);
            return;
        }

        res.writeHead(200);
        res.end('Result: '+body.result);
    });

//    var options = {
//        scheme: 'http',
//        host: 'localhost',
//        port: 3001,
//        method: 'POST'
//    };
//
//    var request = http.request(options, function (response) {
//        var chunks = [];
//
//        response.once('readable', function () {
//            var chunk;
//            while ((chunk = response.read()) !== null) {
//                chunks.push(chunk);
//            }
//        });
//
//        response.on('end', function () {
//            res.writeHead(200);
//            res.end('Result: '+Buffer.concat(chunks).toString());
//        });
//    });
//
//    request.write(new Buffer(JSON.stringify({ number : 300 })));
//
//    request.end();
});

server.listen(3000, function () {
    console.log('Listening on port 3000');
});