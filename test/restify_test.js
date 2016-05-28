var server = require("../lib/index.js");
server.handle = function (req, res) {this.server.emit('request', req, res);}

var http = require('http');
var Response = http.ServerResponse;
Response.prototype.when_done = function() {
	var req = this;
	return new Promise(function (fulfill, reject) {
		req.send = function () {
			fulfill(arguments);
		};
	});
}
