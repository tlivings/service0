'use strict';

var service0 = require('../../index'),
    cluster = require('cluster');

var broker, service;

if (cluster.isMaster) {
    broker = service0.broker({
        address : 'ipc://broker',
        broadcast : 'ipc://workers'
    });

    console.log('Started broker.');

    for (var i = 1; i <= require('os').cpus().length; i++) {
        cluster.fork();
    }
}
else {
    service = service0.service(_work).connect('ipc://workers');
    console.log('Started worker.');
}

function _work(body, callback) {
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
        if( n % i === 0 ) {
            return false;
        }
    }
    return true;
}