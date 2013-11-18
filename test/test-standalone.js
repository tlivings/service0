'use strict';

var assert = require('assert'),
    services = require('../index');

describe('test', function () {

    var testService;

    before(function (next) {
        testService = services.service({ msgpack: true }, function (headers, body, callback) {
            callback(null, 'Hello');
        });

        testService.bind('inproc://test');

        next();
    });

    it('should send Hello to client', function (next) {

        var client = services.client({
            keepalive : true,
            msgpack : true
        });

        client.send('inproc://test', 'Hello World!', function (error, headers, body) {
            assert(!error);
            assert(body === 'Hello');
            testService.close();
            client.close();
            next();
        });

    });

});
