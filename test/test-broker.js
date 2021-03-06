'use strict';

var assert = require('assert'),
    service0 = require('../index');

describe('test', function () {

    var broker, testService;

    before(function (next) {
        testService = service0.service(function (message, callback) {
            callback(null, 'Hello');
        });

        service0.broker({ address : 'ipc://broker', broadcast : 'ipc://worker'});

        testService.connect('ipc://worker');

        next();
    });

    it('should send Hello to client', function (next) {
        var client = service0.client('ipc://broker');

        client.send('Hello World!', function (error, message) {
            assert(!error);
            assert(message === 'Hello');
            testService.close();
            next();
        });

    });

});
