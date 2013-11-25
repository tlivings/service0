'use strict';

var zmq = require('zmq');

exports = module.exports = function () {
    var socket;

    socket = zmq.socket('req');

    return {
        send: function (address, message, callback) {
            socket.connect(address);

            socket.once('message', function (error, message) {
                error = error && error.length > 0 ? JSON.parse(error) : undefined;
                message = message && message.length > 0 ? JSON.parse(message) : undefined;

                callback && setImmediate(callback.bind(null, error, message));

                socket.disconnect(address);
            });

            socket.send(JSON.stringify(message));
        }
    };
};

