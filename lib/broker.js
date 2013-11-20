'use strict';

var assert = require('assert'),
    zmq = require('zmq');

exports = module.exports = function (options, done) {
    var router, dealer;

    assert.strictEqual(typeof options, 'object');
    assert.ok(options.address);
    assert.ok(options.broadcast);

    router = zmq.socket('router');
    dealer = zmq.socket('dealer');

    function onMessage () {
        var args = Array.prototype.slice.call(arguments),
            socket = args.shift();

        socket.send(args);
    }

    router.on('message', onMessage.bind(null, dealer));
    dealer.on('message', onMessage.bind(null, router));

    if (done) {
        router.bind(options.address, function () {
            dealer.bind(options.broadcast, function () {
                done();
            });
        });
    }
    else {
        router.bindSync(options.address);
        dealer.bindSync(options.broadcast);
    }

    return {
        close: function () {
            router.close();
            dealer.close();
        },
        disconnect: function (address, broadcast) {
            router.disconnect(address);
            dealer.disconnect(broadcast);
        }
    };

};