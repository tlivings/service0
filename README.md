### Overview

A very simple API for client-server communication over zeromq.

### Example (no Broker)

```javascript
var zmqsi = require('zmqsi');

var service = new zmqsi.Service(),
    client = new zmqsi.Client();

service.bind('inproc://test'); //No callback binds synchronously.

service.on('message', function (headers, body, callback) {
    callback(null, 'Hello');
});

client.send('inproc://test', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```

### Broker

```javascript
var zmqsi = require('zmqsi');

var broker = new zmqsi.Broker(),
    service = new zmqsi.Service(),
    client = new zmqsi.Client();

broker.bind({ address : 'inproc://broker', bindAddress : 'inproc://worker'});

testService.connect('inproc://worker');

testService.on('message', function (headers, body, callback) {
    callback(null, 'Hello');
});

client.send('inproc://broker', 'Hello World!', function (error, headers, body) {
    console.log(body);
});
```

This api uses [MessagePack](http://msgpack.org/) to serialize and deserialize JSON payloads.