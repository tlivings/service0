'use strict';

var uuid = require('uuid'),
    msgpack = require('msgpack');

function Headers (options) {
    if (!options) {
        options = {};
    }

    this._correlationId = options.correlationId || uuid.v4();
    this._contentType = 'application/x-msgpack';
    this._error = options.error;
}

Headers.prototype = {
    get correlationId() {
        return this._correlationId;
    },
    get contentType() {
        return this._contentType;
    },
    get error() {
        return this._error;
    }
};

function Message (body, headers) {
    this._headers = new Headers(headers);
    this._body = body;
}

Message.unpack = function (raw) {
    var message = msgpack.unpack(raw);
    return new Message(message.body, message.headers);
};

Message.prototype = {
    get headers() {
        return this._headers;
    },
    get body() {
        return this._body;
    },
    toString : function () {
        return JSON.stringify(this);
    },
    pack : function () {
        return msgpack.pack(this);
    }
};

exports = module.exports = Message;