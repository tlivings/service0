"use strict";

var Message = require("./message").Message,
	zmq = require("zmq");

function Service() {
	this._socket = zmq.socket('rep');
}

Service.prototype = {

	destroy : function() {
		this._socket.close();
	},

	bind : function(address, done) {
		this._socket.bind(address, function() {
			this._socket.on("message", function(data) {
				var message, headers, body;

				message = Message.unpack(data);

				headers = message.headers;
				body = message.body;

				this._doService(headers, body, this._sendResponse.bind(this));

			}.bind(this));

			done();
		}.bind(this));
	},

	_doService : function(headers, body, done) {
		process.nextTick(function() {
			try {
				done(headers.correlationId, this.doService(body));
			}
			catch(e) {
				this._sendError(headers.correlationId, e);
			}
		}.bind(this));
	},

	_send : function(correlationId, message) {
		this._socket.send(message);
	},

	_sendResponse : function(correlationId, msg) {
		var message = new Message(msg, { correlationId : correlationId });
		this._send(correlationId, message.pack());
	},

	_sendError : function(correlationId, error) {
		var message = new Message(error.message, { correlationId : correlationId, error : error.type });
		this._send(correlationId, message.pack());
	},

	/**
	 * Abstract.
	 * @param body
	 */
	doService : function(body) {
		throw new Error("Not implemented.");
	}

}

module.exports = Service;