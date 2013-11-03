'use strict';

var assert = require('assert'),
    services = require('../index');

describe('test', function () {

    var broker, testService;

    before(function (next) {
        testService = new services.Service();
        broker = new services.Broker();

        broker.bind('inproc://broker', function (address) {
            testService.connect(address);

            testService.on('message', function (headers, body, callback) {
                callback(null, 'Hello');
            });

            next();
        });
    });

    it('should send Hello to client', function (next) {
        var client = new services.Client();

        client.send('inproc://broker', 'Hello World!', function (error, headers, body) {
            assert(!error);
            assert(body === 'Hello');
            testService.close();
            next();
        });

    });

});
