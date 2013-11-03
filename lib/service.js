'use strict';

var Message = require('./message'),
    extend = require('./extend'),
    zmq = require('zmq');

function Service () {
    this._socket = zmq.socket('rep');
    this._socket.on('message', this._onMessage.bind(this));
}

extend(Service, require('events').EventEmitter, {

    close : function () {
        this._socket.close();
    },

    bind : function (address, done) {
        this._socket.bind(address, function () {
            done();
        });
    },

    connect : function (address) {
        this._socket.connect(address);
    },

    _onMessage : function (data) {
        var message, headers, body;

        message = Message.unpack(data);

        headers = message.headers;
        body = message.body;

        this.emit('message', headers, body, this._sendResponse.bind(this, headers.correlationId));
    },

    _send : function (data) {
        this._socket.send(data);
    },

    _sendResponse : function () {
        var correlationId = arguments[0],
            error = arguments[1],
            message = arguments[2];

        if (error) {
            if (!(error instanceof Error)) {
                error = new Error(error);
            }
            message = new Message(error.message, { correlationId : correlationId, error : true });
        }
        else {
            message = new Message(message, { correlationId : correlationId });
        }

        this._send(message.pack());
    }

});

exports = module.exports = Service;
