var restify = require("restify");
var Compose = require("./compose.js");

require("./utils.js");

var server = restify.createServer();
server.use(restify.jsonBodyParser({maxBodySize: 60 * 1024}));

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
		.get_stack(stack).load()
		.compose(
			res.handle_response(
				next,
				{"error_class": restify.errors.NotFoundError}
			)
		)
	;
});

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});

