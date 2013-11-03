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

        if (typeof options === 'string') {
            options = url.parse(options);
        }
        if (!options.protocol) {
            options.protocol = 'inproc:';
        }
        if (!options.protocol.indexOf(':')) {
            options.protocol += ':';
        }

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

                self._router.on('message', function () {
                    self._dealer.send(Array.prototype.slice.call(arguments));
                });

                self._dealer.on('message', function () {
                    self._router.send(Array.prototype.slice.call(arguments));
                });

                done(dealerAddress);
            });
        });
    }

};

exports = module.exports = Broker;