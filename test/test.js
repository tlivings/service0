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
			var client = new services.Client();

			client.send("inproc://test", "Hello World!", function(error, result) {
				console.log(error || result);
				client.destroy();
				testService.destroy();
				next();
			});
		});
	});

});