'use strict';

var zmq = require('zmq'),
    assert = require('assert');

exports = module.exports = function (address) {
    var socket;

    assert(typeof address === 'string');

    socket = new zmq.socket('req');

    socket.connect(address);

    return {
        send: function (message, callback) {

            socket.once('message', function (error, message) {
                error = error && error.length > 0 ? JSON.parse(error) : undefined;
                message = message && message.length > 0 ? JSON.parse(message) : undefined;

                callback && setImmediate(callback.bind(null, error, message));
            });

            socket.send(JSON.stringify(message));
        },
        disconnect: function (address) {
            socket.disconnect(address);
        },
        close: function () {
            socket.close();
        }
    };
};

