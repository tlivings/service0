'use strict';

var uuid = require('uuid'),
    msgpack = require('msgpack');

exports = module.exports = {
    create: function (body, headers) {

        if (!headers) {
            headers = {};
        }

        if (!headers.correlationId) {
            headers.correlationId = uuid.v1();
        }

        return {
            get headers() {
                return headers;
            },
            get body() {
                return body;
            },
            toString : function () {
                return JSON.stringify(this);
            },
            pack : function () {
                return headers.msgpack ? msgpack.pack(this) : this.toString();
            }
        };
    },

    unpack: function (raw, options) {
        var message;

        if (!options) {
            options = {};
        }

        message = options.msgpack ? msgpack.unpack(raw) : JSON.parse(raw);

        return this.create(message.body, message.headers);
    }
};