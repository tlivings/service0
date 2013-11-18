# ZMQSI

A very simple API for RPC over zeromq.


# API

### Service

Created with `zmqsi.service(options, fn)`.

`options.msgpack` - use [msgpack](http://msgpack.org/).
`fn` - service function of the form `function (headers, body, callback)`.

#### API

`bind(address, callback)` - bind to the given address, synchronously if the optional `callback` is not provided.
`connect(address)` - connect to the given `address`.
`close` - closes the socket.

### Client

Created with `zmqsi.client(options)`.

`options.msgpack` - use [msgpack](http://msgpack.org/).
`options.keepalive` - keep socket open until explicitly closed.

#### API

`client.send(address, message, callback)` - send the given message. `callback` is of the form `function (error, headers, body)`.
`client.close` - closes the socket (if open).

### Broker

Created with `zmqsi.broker(options)`.

`options.address` - broker address.
`options.broadcast` - broadcast address for workers / services to listen on.

#### API

`close` - closes the broker sockets.


# Examples

### No Broker

```javascript
var zmqsi = require('zmqsi');

var service, client;

service = zmqsi.service(function (headers, body, callback) {
    callback(null, 'Hello');
}).bind('inproc://test');

client = zmqsi.client(options);

client.send('inproc://test', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```

### Broker

```javascript
var zmqsi = require('zmqsi');

var broker, service, client;

broker = zmqsi.broker({ address : 'ipc://broker', broadcast : 'ipc://worker'});

service = zmqsi.service(function (headers, body, callback) {
    callback(null, 'Hello');
}).connect('ipc://worker');

client = zmqsi.client();

client.send('ipc://broker', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```