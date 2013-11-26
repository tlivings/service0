# Service0

A very simple API for RPC over [zeromq](http://www.zeromq.org/intro:get-the-software).

This API is meant to serve as the bare-minimum RPC invocation, with the expectation that additional layers might
be provided on top of it.

# Setup

Install [zeromq](http://www.zeromq.org/intro:get-the-software) first.

Can also be installed using [homebrew](http://brew.sh/) on OS X.

```bash
brew install zeromq
```

# API

Sockets created are 0mq sockets as per [zeromq.node](https://github.com/JustinTulloss/zeromq.node).

### Service Socket

Created with `service0.service(fn)`.

- `fn` - service function of the form `function (body, callback)`.

### Client Socket

Created with `service0.client(options)`.

#### API

- `client.send(message, callback)` - send the given message. `callback` is of the form `function (error, message)`.

### Broker

Created with `service0.broker(options)`.

- `options.address` - broker address.
- `options.broadcast` - broadcast address for workers / services to listen on.

#### API

- `close` - closes the broker sockets.
- `disconnect` - disconnects the broker sockets.

# Examples

### No Broker

```javascript
var service0 = require('service0');

var service, client;

service = service0.service(function (message, callback) {
    callback(null, 'Hello');
}).bindSync('inproc://test');

client = service0.client('inproc://test');

client.send('Hello World!', function (message) {
    console.log(message);
});
```

### Broker

```javascript
var service0 = require('service0');

var broker, service, client;

broker = service0.broker({ address : 'ipc://broker', broadcast : 'ipc://worker'});

service = service0.service(function (message, callback) {
    callback(null, 'Hello');
}).connect('ipc://worker');

client = service0.client('ipc://broker');

client.send('Hello World!', function (message) {
    console.log(message);
});
```