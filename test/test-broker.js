'use strict';

var assert = require('assert'),
    services = require('../index');

describe('test', function () {

    var broker, testService;

    before(function (next) {
        testService = services.service(function (headers, body, callback) {
            callback(null, 'Hello');
        });

        services.broker({ address : 'ipc://broker', broadcast : 'ipc://worker'});

        testService.connect('ipc://worker');

        next();
    });

    it('should send Hello to client', function (next) {
        var client = services.client();

        client.send('ipc://broker', 'Hello World!', function (error, headers, body) {
            assert(!error);
            assert(body === 'Hello');
            testService.close();
            next();
        });

    });

});
