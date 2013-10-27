'use strict';

var uuid = require('uuid'),
    msgpack = require('msgpack');

function Headers (data) {
    if (!data) {
        data = {};
    }
    this.correlationId = data.correlationId || uuid.v4();
    this.contentType = undefined;

    if (data.error) {
        this.error = data.error;
    }
}

function Message (body, headers) {
    this.headers = new Headers(headers);
    this.body = undefined;

    if (body) {
        this.headers.contentType = (typeof body)
        this.body = body;
    }
}

Message.unpack = function (raw) {
    var message = msgpack.unpack(raw);
    return new Message(message.body, message.headers);
};

Message.prototype = {
    toString : function () {
        return JSON.stringify(this);
    },
    pack : function () {
        return msgpack.pack(this);
    }
};

module.exports = {
    Headers : Headers,
    Message : Message
};