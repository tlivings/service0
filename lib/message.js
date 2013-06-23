"use strict";

var uuid = require("uuid");

function Headers(data) {
	if(!data) {
		data = {};
	}
	this.correlationId = data.correlationId || uuid.v4();
	this.contentType = undefined;

	if(data.error) {
		this.error = data.error;
	}
}

function Message(body, headers) {
	this.headers = new Headers(headers);
	this.body = undefined;

	if(body) {
		if(typeof this.body === "object") {
			this.headers.contentType = "application/json";
			this.body = body;
		}
		else {
			this.headers.contentType = "plain/text";
			this.body = body.toString();
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