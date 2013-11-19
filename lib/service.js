'use strict';

var assert = require('assert'),
    zmq = require('zmq');

exports = module.exports = function (options, handler) {
    var socket;

    if (typeof options === 'function') {
        handler = options;
        options = null;
    }

    if (!options) {
        options = {};
    }

    assert.strictEqual(typeof handler, 'function');

    socket = zmq.socket('rep');

    socket.on('message', function (correlationId, message) {
        correlationId = correlationId.toString();
        message = JSON.parse(message);

        handler(message, function (error, response) {
            if (error) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                response = JSON.stringify(error);
            }
            else {
                response = JSON.stringify(response);
            }

            socket.send([correlationId, response]);
        });
    });

    return {
        bind: function (address, callback) {
            if (socket.connected) {
                socket.close();
            }
            if (callback) {
                socket.bind(address, function () {
                    callback();
                });
            }
            else {
                socket.bindSync(address);
            }
            return this;
        },
        connect: function (address) {
            if (!socket.connected) {
                socket.connect(address);
            }
        },
        close: function () {
            if (socket.connected) {
                socket.close();
            }
        }
    };
};
