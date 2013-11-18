'use strict';

var msg = require('./message'),
    EventEmitter = require('events').EventEmitter,
    zmq = require('zmq');

exports = module.exports = function (options) {
    var socket,
        replyHandler = {};

    if (!options) {
        options = {
            keepalive: false,
            msgpack: false
        };
    }

    socket = zmq.socket('req');

    socket.on('message', function (data) {
        var message, headers, body;

        message = msg.unpack(data, { msgpack: options.msgpack });

        headers = message.headers;
        body = message.body;

        if (headers.error) {
            replyHandler[headers.correlationId](new Error(body), headers);
        }
        else {
            replyHandler[headers.correlationId](null, headers, body);
        }

        if (!options.keepalive) {
            socket.close();
        }
    });

    return {
        send: function (address, message, callback) {
            message = msg.create(message, { msgpack: options.msgpack });

            if (callback) {
                replyHandler[message.headers.correlationId] =  function () {
                    callback.apply(null, arguments);
                    delete replyHandler[message.headers.correlationId];
                };
            }

            if (!socket.connected) {
                socket.connect(address);
            }

            socket.send(message.pack());
        },

        close: function () {
            socket.close();
        }
    };
};

