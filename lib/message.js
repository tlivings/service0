"use strict";

var uuid = require("uuid");

function Headers(data) {
	if(!data) {
		data = {};
	}
	this.correlationId = data.correlationId || uuid.v4();
	this.contentType = data.contentType || "application/json";
	if(data.error) {
		this.error = data.error;
	}
}

function Message(data) {
	if(!data) {
		data = {};
	}
	this.headers = new Headers(data.headers);
	this.body = data.body || undefined;

	if(this.body) {
		if(typeof this.body === "object") {
			this.headers.contentType = "application/json";
		}
		else {
			this.headers.contentType = "plain/text";
		}
	}
}

Message.prototype = {
	toString : function() {
		return JSON.stringify(this);
	}
};

module.exports = {
	Headers  : Headers,
	Message  : Message
};