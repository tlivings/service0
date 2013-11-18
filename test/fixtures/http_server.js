'use strict';

var zmqsi = require('../../index'),
    http = require('http');

var server = http.createServer(function (req, res) {
    var client = new zmqsi.Client();
    client.send('tcp://localhost:3000', { number : 9999 }, function (error, headers, body) {
        if (error || headers.error) {
            res.writeHead(500);
            res.end(error || headers.error);
            return;
        }

        res.writeHead(200);
        res.end('Result: '+body.result);
    });

//    res.writeHead(200);
//    res.end('Result: '+listPrimes(500));

//
//    var request = http.get('http://localhost:8001', function (response) {
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

server.listen(8000);

function listPrimes( nPrimes ) {
    var primes = [];
    for( var n = 2;  nPrimes > 0;  n++ ) {
        if( isPrime(n) ) {
            primes.push( n );
            --nPrimes;
        }
    }
    return primes;
}

function isPrime( n ) {
    var max = Math.sqrt(n);
    for( var i = 2;  i <= max;  i++ ) {
        if( n % i === 0 )
            return false;
    }
    return true;
}