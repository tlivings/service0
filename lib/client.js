"use strict";

var Message = require("./message").Message,
	extend = require("./extend"),
	EventEmitter = require("events").EventEmitter,
	zmq = require("zmq");

function Client() {
	this._callbacks = {};
	this._socket = zmq.socket('req');
	this._socket.on("message", this._onMessage.bind(this));
}

extend(Client, EventEmitter, {

	destroy : function() {
		this._socket.close();
	},

	send : function(address, message, callback) {
		if(!(message instanceof Message)) {
			message = new Message(message);
		}

		this._callbacks[message.headers.correlationId] = function(error, response) {
			this._socket.disconnect(address);
			callback.apply(null, arguments);
		}.bind(this);

		this._socket.connect(address);

		this._socket.send(message.toString());
	},

	_onMessage : function(data) {
		var message, headers, body;

		try {
			message = JSON.parse(data.toString());
		}
		catch(e) {
			throw new Error("Message payload must be JSON.");
		}

		headers = message.headers;
		body = message.body;

		var callback = this._callbacks[headers.correlationId];

		if(!callback) {
			this.emit("error", "No callback associated with correlationId : " + headers.correlationId);
		}
		else {
			if(headers.error) {
				callback(new Error(body), null);
			}
			else {
				callback(null, body);
			}
			this.emit("message", message);
		}
	}

});

module.exports = Client;

