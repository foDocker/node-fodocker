var restify = require("restify");
var Compose = require("./compose.js");

require("./utils.js");

var errors = [
	{
		"test"	: error => error["code"] == 'ENOENT',
		"class"	: restify.errors.NotFoundError
	}
]

var server = restify.createServer();
server.use(restify.bodyParser({maxBodySize: 60 * 1024}));

server.post('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	var content = req.body;
	Compose
		.save_stack(stack, content)
		.then(stack => undefined)
		.compose(res.handle_response(next, {"success_code": 201}))
	;
});

server.get('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.get_stack(stack)
		.compose(
			res.handle_response(next, {"errors": errors})
		)
	;
});

server.del('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.del_stack(stack)
		.compose(
			res.handle_response(next, {"errors": errors})
		)
	;
});

server.post('/stacks/:stack/run', function(req, res, next) {
	var stack = req.params.stack;
	var scales = req.body ? JSON.parse(req.body) : {};
	Compose
		.start(stack, scales)
		.compose(
			res.handle_response(next, {"errors": errors})
		)
	;
});

server.get('/stacks/:stack/run', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.ps(stack)
		.compose(
			res.handle_response(next, {"errors": errors})
		)
	;
});

server.del('/stacks/:stack/run', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.stop(stack)
		.compose(
			res.handle_response(next, {"errors": errors})
		)
	;
});

module.exports = server;
