'use strict';

var uuid = require('uuid');

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
            }
        };
    },

    parse: function (raw) {
        var message = JSON.parse(raw);
        return this.create(message.body, message.headers);
    }
};