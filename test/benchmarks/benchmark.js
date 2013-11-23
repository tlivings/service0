'use strict';

var Benchmark = require('benchmark'),
    suite = new Benchmark.Suite('service0 vs http'),
    http = require('http');

var service0 = require('../../index');

var service = service0.service(function (message, callback) {
    callback(null, listPrimes(message.n));
}).bind('tcp://*:3001');

var server = http.createServer(function (req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var message = JSON.parse(body);
        res.writeHead(200);
        res.end('Result: ' + listPrimes(message.n));
    });
});

server.listen(3000, function () {

    suite.add('service0', {
        'id': 'service0',
        'fn': function (deferred) {
            service0.client().send('tcp://localhost:3001', {n: 300}, function (error, message) {
                return deferred.resolve();
            });
        },
        'defer': true
    });

    suite.add('http', {
        'id': 'http',
        'fn': function (deferred) {
            var options = {
                scheme: 'http',
                host: 'localhost',
                port: 3000,
                method: 'POST'
            };
            var req = http.request(options, function (response) {
                response.once('readable', function () {
                    while (response.read() !== null);
                });
                response.on('end', function () {
                    return deferred.resolve();
                });
            });
            req.write(new Buffer(JSON.stringify({n: 300})));
            req.end();
        },
        'defer': true
    });


    suite.on('cycle', function (event) {
        console.log(String(event.target));
    });

    suite.on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        process.exit(0);
    });


    suite.run({ 'async': true });

});

function listPrimes(nPrimes) {
    var primes = [];
    for (var n = 2; nPrimes > 0; n++) {
        if (isPrime(n)) {
            primes.push(n);
            --nPrimes;
        }
    }
    return primes;
}

function isPrime(n) {
    var max = Math.sqrt(n);
    for (var i = 2; i <= max; i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}