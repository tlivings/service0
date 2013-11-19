'use strict';

var uuid = require('uuid'),
    zmq = require('zmq');

exports = module.exports = function (options) {
    var socket,
        replyHandler = {};

    if (!options) {
        options = {
            keepalive: false
        };
    }

    socket = zmq.socket('req');

    socket.on('message', function (correlationId, message) {
        correlationId = correlationId.toString();
        message = JSON.parse(message);

        replyHandler[correlationId](message);

        if (!options.keepalive) {
            socket.close();
        }
    });

    return {
        send: function (address, message, callback) {
            var correlationId = uuid.v1();

            message = JSON.stringify(message);

            if (callback) {
                replyHandler[correlationId] =  function () {
                    callback.apply(null, arguments);
                    delete replyHandler[correlationId];
                };
            }

            if (!socket.connected) {
                socket.connect(address);
            }

            socket.send([correlationId, message]);
        },
        close: function () {
            if (socket.connected) {
                socket.close();
            }
        }
    };
};

