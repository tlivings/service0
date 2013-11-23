'use strict';

var assert = require('assert'),
    zmq = require('zmq');

exports = module.exports = function (handler) {
    var socket;

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
                socket.disconnect(address);
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
            socket.close();
        },
        disconnect: function (address) {
            if (socket.connected) {
                socket.disconnect(address);
            }
        }
    };
};
