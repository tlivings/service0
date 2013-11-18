# Service0

A very simple API for RPC over [zeromq](http://www.zeromq.org/intro:get-the-software).

# Setup

Install [zeromq](http://www.zeromq.org/intro:get-the-software) first.

Can also be installed using [homebrew](http://brew.sh/) on OS X.

```shell
brew install zeromq
```

# API

### Service

Created with `service0.service(options, fn)`.

- `options` - no available options as of now.
- `fn` - service function of the form `function (headers, body, callback)`.

#### API

- `bind(address, callback)` - bind to the given address, synchronously if the optional `callback` is not provided.
- `connect(address)` - connect to the given `address`.
- `close` - closes the socket.

### Client

Created with `service0.client(options)`.

- `options.keepalive` - keep socket open until explicitly closed.

#### API

- `client.send(address, message, callback)` - send the given message. `callback` is of the form `function (error, headers, body)`.
- `client.close` - closes the socket (if open).

### Broker

Created with `service0.broker(options)`.

- `options.address` - broker address.
- `options.broadcast` - broadcast address for workers / services to listen on.

#### API

- `close` - closes the broker sockets.


# Examples

### No Broker

```javascript
var service0 = require('service0');

var service, client;

service = service0.service(function (headers, body, callback) {
    callback(null, 'Hello');
}).bind('inproc://test');

client = service0.client(options);

client.send('inproc://test', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```

### Broker

```javascript
var service0 = require('service0');

var broker, service, client;

broker = service0.broker({ address : 'ipc://broker', broadcast : 'ipc://worker'});

service = service0.service(function (headers, body, callback) {
    callback(null, 'Hello');
}).connect('ipc://worker');

client = service0.client();

client.send('ipc://broker', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```