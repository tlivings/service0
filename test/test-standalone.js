'use strict';

var assert = require('assert'),
    service0 = require('../index'),
    zmq = require('zmq');

describe('test', function () {

    var testService;

    before(function (next) {
        testService = service0.service(function (message, callback) {
            if (message === 'error') {
                callback(new Error('bad!'));
            }
            else {
                callback(null, 'Hello');
            }
        });

        testService.bind('inproc://test');

        next();
    });

    it('should send Hello to client', function (next) {

        var client = service0.client();

        client.send('inproc://test', 'Hello World!', function (error, message) {
            assert(!error);
            assert(message === 'Hello');
            testService.close();
            next();
        });

    });

    it('should send error to client', function (next) {

        var client = service0.client();

        client.send('inproc://test', 'error', function (error, message) {
            assert(error);
            assert(typeof error === 'object');
            assert(error.name === 'Error');
            assert(error.message === 'bad!');
            testService.close();
            next();
        });

    });

});
