'use strict';

var Message = require('./message'),
    extend = require('./extend'),
    zmq = require('zmq');

function Service (options) {
    if (!options) {
        options = {
            msgpack: false
        };
    }
    this._socket = zmq.socket('rep');
    this._socket.on('message', this._onMessage.bind(this));
    this._msgpack = !!options.msgpack;
}

extend(Service, require('events').EventEmitter, {

    close : function () {
        this._socket.close();
    },

    bind : function (address, done) {
        if (done) {
            this._socket.bind(address, function () {
                done();
            });
        }
        else {
            this._socket.bindSync(address);
        }
        return this;
    },

    connect : function (address) {
        this._socket.connect(address);
    },

    _onMessage : function (data) {
        var message, headers, body;

        message = Message.unpack(data, { msgpack: this._msgpack });

        headers = message.headers;
        body = message.body;

        this.emit('message', headers, body, this._sendResponse.bind(this, headers));
    },

    _send : function (data) {
        this._socket.send(data);
    },

    _sendResponse : function () {
        var headers = arguments[0],
            error = arguments[1],
            message = arguments[2];

        if (error) {
            if (!(error instanceof Error)) {
                error = new Error(error);
            }
            message = Message.create(error.message, { correlationId : headers.correlationId, error : true, msgpack: headers.msgpack });
        }
        else {
            message = Message.create(message, { correlationId : headers.correlationId, msgpack: headers.msgpack });
        }

        this._send(message.pack());
    }

});

exports = module.exports = Service;
