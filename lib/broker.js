'use strict';

var extend = require('./extend'),
    url = require('url'),
    uuid  = require('uuid'),
    zmq = require('zmq');

function Broker (options) {
    this._router = zmq.socket('router');
    this._dealer = zmq.socket('dealer');
}

Broker.prototype = {

    bind: function (options, done) {
        var self = this;
        var address, dealerHost, dealerPort, dealerAddress;

        options = _normalizeOptions(options);

        if (options.protocol === 'inproc:') {
            dealerHost = uuid.v4();
        }
        else {
            dealerHost = options.host;
            dealerPort = options.dealerPort || options.port;
        }

        address = options.protocol + '//' + options.host + (options.port ? ':' + options.port : '') + (options.path ? options.path : '');
        dealerAddress = options.protocol + '//' + dealerHost + (dealerPort ? ':' + dealerPort : '');

        this._router.bind(address, function () {

            self._dealer.bind(dealerAddress, function () {
                self._router.on('message', _forward.bind(null, self._dealer));
                self._dealer.on('message', _forward.bind(null, self._router));
                done(dealerAddress);
            });
        });
    }

};

function _forward () {
    var args = Array.prototype.slice.call(arguments);
    var socket = args.shift();
    socket.send(args);
}

function _normalizeOptions (options) {
    if (typeof options === 'string') {
        options = url.parse(options);
    }
    if (!options.protocol) {
        options.protocol = 'inproc:';
    }
    if (!options.protocol.indexOf(':')) {
        options.protocol += ':';
    }
    return options;
}

exports = module.exports = Broker;