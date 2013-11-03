'use strict';

var extend = require('./extend'),
    uuid  = require('uuid'),
    zmq = require('zmq');

function Broker (options) {
    this._workerAddress = uuid.v4();
    this._router = zmq.socket('router');
    this._dealer = zmq.socket('dealer');
}

Broker.prototype = {

    bind: function (options, done) {
        var self = this;
        var protocol, dealerPort, dealerAddress;

        if (typeof options === 'string') {
            options = { address : options };
        }

        protocol = options.address.substr(0, options.address.indexOf(':'));
        dealerPort = options.address.substr(options.address.lastIndexOf(':') + 1);

        if (!Number.isNaN(dealerPort)) {
            dealerPort = false;
        }
        else {
            dealerPort += 1;
        }

        dealerAddress = protocol+'://'+self._workerAddress + (dealerPort ? ':' + dealerPort : '');

        this._router.bind(options.address, function () {

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