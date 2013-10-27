'use strict';

var Message = require('./message').Message,
    extend = require('./extend'),
    zmq = require('zmq');

function Service () {
    this._socket = zmq.socket('rep');
}

extend(Service, require('events').EventEmitter, {

    destroy : function () {
        this._socket.close();
    },

    bind : function (address, done) {
        this._socket.bind(address, function () {
            this._socket.on('message', function (data) {
                var message, headers, body;

                message = Message.unpack(data);

                headers = message.headers;
                body = message.body;

                this.emit('message', headers, body, this._sendResponse.bind(this, headers.correlationId));

            }.bind(this));

            if (done) {
                done();
            }
            else {
                this.emit('connect');
            }
        }.bind(this));
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

module.exports = Service;
