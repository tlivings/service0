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

    socket.on('message', function (headers, message) {
        headers = headers && headers.length > 0 ? JSON.parse(headers) : {};
        message = message && message.length > 0 ? JSON.parse(message) : {};

        replyHandler[headers.correlationId](headers.error, message);

        if (!options.keepalive) {
            socket.close();
        }
    });

    return {
        send: function (address, message, callback) {
            var headers = {
                correlationId: uuid.v1()
            };

            if (callback) {
                replyHandler[headers.correlationId] =  function () {
                    callback.apply(null, arguments);
                    delete replyHandler[headers.correlationId];
                };
            }

            if (!socket.connected) {
                socket.connect(address);
            }

            socket.send([JSON.stringify(headers), JSON.stringify(message)]);
        },
        close: function () {
            if (socket.connected) {
                socket.close();
            }
        }
    };
};

