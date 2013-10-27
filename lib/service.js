'use strict';

var Message = require('./message'),
    extend = require('./extend'),
    zmq = require('zmq');

function Service () {
    this._socket = zmq.socket('rep');
}

extend(Service, require('events').EventEmitter, {

    close : function () {
        this._socket.close();
    },

    bind : function (address, done) {
        var self = this;
        this._socket.bind(address, function () {
            self._socket.on('message', function (data) {
                var message, headers, body;

                message = Message.unpack(data);

                headers = message.headers;
                body = message.body;

                self.emit('message', headers, body, self._sendResponse.bind(self, headers.correlationId));
            });

            if (done) {
                done();
            }
            else {
                self.emit('connect');
            }
        });
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
