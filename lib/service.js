"use strict";

var Message = require("./message").Message,
	extend = require("./extend"),
	EventEmitter = require("events").EventEmitter,
	zmq = require("zmq");

function Service() {
	this._socket = zmq.socket('rep');
}

extend(Service, EventEmitter, {

	bind : function(address, done) {
		this._socket.bind(address, function() {
			this._socket.on("message", function(data) {

				var request;

				try {
					request = JSON.parse(data.toString());
				}
				catch(e) {
					this._sendError(null, new Error("Message payload must be JSON."));
					return;
				}

				var message = new Message(request);
				var headers = message.headers;
				var body = message.body || '';

				this._doService(headers, body, this._sendResponse.bind(this));

			}.bind(this));

			done();

			this.emit("listening", this);
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

	_send : function(response) {
		this._socket.send(response.toString());
	},

	_sendResponse : function(correlationId, result) {
		this._send(new Message({
			headers : {
				correlationId : correlationId
			},
			body : result
		}));
	},

	_sendError : function(correlationId, error) {
		this._send(new Message({
			headers : {
				error : true,
				correlationId : correlationId
			},
			body : {
				name  : error.name,
				error : error.message
			}
		}));
	},

	/**
	 * Abstract method should be implemented in subclass.
	 * @param body
	 */
	doService : function(body) {
		throw new Error("Not implemented.");
	}

});

module.exports = Service;