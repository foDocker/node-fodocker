require("./restify_test.js")

var assert = require('chai').assert;

var http = require('http');
var Request = http.IncomingMessage;
var Response = http.ServerResponse;

describe('compose_api', function() {
	describe('stack crud', function () {
		it('should return 201 when a stack is posted', function (done) {

			var server = require("../lib/index.js");

			var req = new Request();
			req.url = "/stacks/mystack2";
			req.method = 'POST';
			req.body = 	"asdfasd\n";

			var res = new Response(req);

			server.handle(req, res);

			res
				.when_done()
				.then(result => {
					assert.equal(result, {"0": 201, "1": undefined});
					done();
				})
				.catch(e=>done(e))
			;
		});
	});
});
