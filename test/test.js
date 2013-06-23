"use strict";

var assert = require("assert"),
	services = require("../index"),
	zmq = require("zmq");

describe("test", function() {

	var TestService;

	before(function(next) {

		TestService = function TestService() {
			TestService.super_.apply(this);
		};

		services.extend(TestService, services.Service, {

			doService : function(message) {
				return "Hello.";
			}

		});

		next();
	});

	it("should do something", function(next) {

		var socket = zmq.socket("req");

		var testService = new TestService();

		testService.bind("inproc://test", function() {
			socket.connect("inproc://test");
			socket.send(JSON.stringify({
				headers : {
					correlationId : "1234",
					contentType : "application/json"
				},
				body : {
					message : "Hello World!"
				}
			}));
			socket.on("message", function(msg) {
				msg = msg.toString();
				var response = JSON.parse(msg);
				console.log(response);
				next();
			});
		});
	});

});