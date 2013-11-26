'use strict';

var zmq = require('zmq'),
    assert = require('assert');

exports = module.exports = function (address) {
    var socket, send;

    assert(typeof address === 'string');

    socket = new zmq.socket('req');

    socket.connect(address);

    send = socket.send;

    socket.send = function (message, callback) {

        socket.once('message', function (error, message) {
            error = error && error.length > 0 ? JSON.parse(error) : undefined;
            message = message && message.length > 0 ? JSON.parse(message) : undefined;

            callback && setImmediate(callback.bind(null, error, message));
        });

        send.call(socket, JSON.stringify(message));
    };

    return socket;
};

