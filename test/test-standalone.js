'use strict';

var assert = require('assert'),
    services = require('../index');

describe('test', function () {

    var testService;

    before(function (next) {
        testService = new services.Service();

        testService.bind('inproc://test', function () {
            testService.on('message', function (headers, body, callback) {
                callback(null, 'Hello');
            });
            next();
        });
    });

    it('should send Hello to client', function (next) {

        var client = new services.Client({
            keepalive : true
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
