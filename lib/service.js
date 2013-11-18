'use strict';

var msg = require('./message'),
    assert = require('assert'),
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

    //TODO: Handle multipart
    socket.on('message', function (data) {
        var message, headers, body;

        message = msg.parse(data);

        headers = message.headers;
        body = message.body;

        handler(headers, body, function (error, response) {
            if (error) {
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                message = msg.create(error.message, { correlationId : headers.correlationId, error : true });
            }
            else {
                message = msg.create(response, { correlationId : headers.correlationId });
            }

            socket.send(message.toString());
        });
    });

    return {
        bind: function (address, callback) {
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
            socket.connect(address);
        },
        close: function () {
            socket.close();
        }
    };
};
