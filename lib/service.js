'use strict';

var assert = require('assert'),
    zmq = require('zmq');

exports = module.exports = function (handler) {
    var socket;

    assert.strictEqual(typeof handler, 'function');

    socket = new zmq.socket('rep');

    socket.on('message', function (message) {
        message = message && message.length > 0 ? JSON.parse(message) : {};

        handler(message, function (error, result) {
            var response = [];

            if (error) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                error = JSON.stringify({ error: true, name: error.name, message: error.message })
            }
            else {
                error = '';
            }

            response.push(error);

            if (result) {
                response.push(JSON.stringify(result));
            }

            socket.send(response);
        });
    });

    return socket;
};
