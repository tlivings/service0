'use strict';

var zmqsi = require('../../index'),
    http = require('http');

var client = new zmqsi.Client({ keepalive: true });

var server = http.createServer(function (req, res) {
    var primes = listPrimes(9999);
    res.writeHead(200);
    res.end(JSON.stringify({ result : primes }));
});

server.listen(8001);

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