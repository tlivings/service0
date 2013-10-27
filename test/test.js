'use strict';

var assert = require('assert'),
    services = require('../index');

describe('test', function () {

    var testService;

    before(function (next) {
        testService = new services.Service();
        next();
    });

    it('should send Hello to client', function (next) {

        testService.bind('inproc://test', function () {
            var client = new services.Client();

            client.send('inproc://test', 'Hello World!', function (error, headers, body) {
                assert(!error);
                assert(body === 'Hello');
                testService.close();
                next();
            });
        });

        testService.on('message', function (headers, body, callback) {
            callback(null, 'Hello');
        });

    });

    it('should send error to client', function (next) {

        var testService = new services.Service();

        testService.bind('inproc://test', function () {
            var client = new services.Client();

            client.send('inproc://test', 'Hello World!', function (error, headers, body) {
                assert(error);
                assert(error.message === 'Error!');
                testService.close();
                next();
            });
        });

        testService.on('message', function (headers, body, callback) {
            callback('Error!');
        });

    });

});
