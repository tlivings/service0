"use strict";

var Message = require("./message").Message,
    objutil = require("objutil"),
	EventEmitter = require("events").EventEmitter,
	zmq = require("zmq");

function Client() {
	this._socket = zmq.socket('req');
	this._socket.on("message", this._onMessage.bind(this));
}

objutil.extend(Client, EventEmitter, {

	send : function(address, message, callback) {
		if(!(message instanceof Message)) {
			message = new Message(message);
		}

		this.once(message.headers.correlationId, callback);

		this._socket.connect(address);

		this._socket.send(message.pack());
	},

	_onMessage : function(data) {
		var message, headers, body;

		message = Message.unpack(data);

		headers = message.headers;
		body = message.body;

		if(headers.error) {
			this.emit(headers.correlationId, new Error(body), headers);
		}
		else {
			this.emit(headers.correlationId, null, headers, body);
		}

		this._socket.close();
	}

});

module.exports = Client;

