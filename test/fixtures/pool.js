'use strict';

var zmqsi = require('../../index');

var workers = [];

var broker = new zmqsi.Broker();

var options = {
    address : 'tcp://*:3000',
    bindAddress : 'inproc://workers'
};

broker.bind(options);

for (var i = 0; i < 500; i++) {
    var service = new zmqsi.Service();
    service.on('message', _work);
    service.connect('inproc://workers');
    workers.push(service);
}

function _work (headers, body, callback) {
    callback(null, { result : listPrimes(body.number)});
}

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