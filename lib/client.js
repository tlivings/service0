'use strict';

var Message = require('./message'),
    extend = require('./extend'),
    EventEmitter = require('events').EventEmitter,
    zmq = require('zmq');

function Client (options) {
    if (!options) {
        options = {
            keepalive: false,
            msgpack: false
        };
    }

    this._socket = zmq.socket('req');
    this._socket.on('message', this._onMessage.bind(this));

    this._keepalive = options.keepalive;
    this._msgpack = !!options.msgpack;
}

extend(Client, EventEmitter, {

    close: function () {
        this._socket.close();
    },

    send : function (address, message, callback) {
        message = Message.create(message, { msgpack: this._msgpack });

        if (callback) {
            this.once(message.headers.correlationId, callback);
        }

        if (!this._socket.connected) {
            this._socket.connect(address);
        }

        this._socket.send(message.pack());
    },

    _onMessage : function (data) {
        var message, headers, body;

        message = Message.unpack(data, { msgpack: this._msgpack });

        headers = message.headers;
        body = message.body;

        if (headers.error) {
            this.emit(headers.correlationId, new Error(body), headers);
        }
        else {
            this.emit(headers.correlationId, null, headers, body);
        }

        if (!this._keepalive) {
            this._socket.close();
        }
    }

});

exports = module.exports = Client;

