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

    socket.on('message', function (headers, message) {
        headers = headers && headers.length > 0 ? JSON.parse(headers) : {};
        message = message && message.length > 0 ? JSON.parse(message) : {};

        handler(message, function (error, result) {
            var response = [];
            if (error) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                headers.error = {
                    name: error.name,
                    message: error.message
                };
            }

            response.push(JSON.stringify(headers));

            if (result) {
                response.push(JSON.stringify(result));
            }

            socket.send(response);
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
