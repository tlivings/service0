'use strict';

var assert = require('assert'),
    service0 = require('../index'),
    zmq = require('zmq');

describe('test', function () {

    var testService;

    before(function (next) {
        testService = service0.service(function (message, callback) {
            callback(null, 'Hello');
        });

        testService.bind('inproc://test');

        next();
    });

    it('should send Hello to client', function (next) {

        var client = service0.client();

        client.send('inproc://test', 'Hello World!', function (message) {
            assert(message === 'Hello');
            testService.close();
            next();
        });

    });

});
