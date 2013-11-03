'use strict';

var extend = require('./extend'),
    assert = require('assert'),
    uuid  = require('uuid'),
    zmq = require('zmq');

function Broker () {
    this._router = zmq.socket('router');
    this._dealer = zmq.socket('dealer');
    this._router.on('message', _forward.bind(null, this._dealer));
    this._dealer.on('message', _forward.bind(null, this._router));
}

Broker.prototype = {

    bind: function (options, done) {
        var self = this;

        assert.strictEqual(typeof options, 'object');
        assert.ok(options.address);
        assert.ok(options.bindAddress);

        if (done) {
            this._router.bind(options.address, function () {
                self._dealer.bind(options.bindAddress, function () {
                    done();
                });
            });
        }
        else {
            this._router.bindSync(options.address);
            this._dealer.bindSync(options.bindAddress);
        }
        return this;
    }

};

function _forward () {
    var args = Array.prototype.slice.call(arguments);
    var socket = args.shift();
    socket.send(args);
}

exports = module.exports = Broker;