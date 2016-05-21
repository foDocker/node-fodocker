var restify = require("restify");
var Compose = require("./compose.js");

Promise.prototype.compose = function (compose_func) {
	return compose_func(this);
}

function respond_response(req, res, next, opts) {
	var success_code = opts["success_code"] || 200;
	var error_class = opts["error_class"] || restify.errors.InternalServerError;
	return function (promise) {
		return promise
			.then(result => {
				res.send(success_code, result);
				next();
			})
			.catch(error => {
				console.error(error);
				next(new error_class(error.message));
			})
	}
}

var server = restify.createServer();
server.use(restify.jsonBodyParser({maxBodySize: 60 * 1024}));

server.post('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	var content = req.body;
	Compose
		.save_stack(stack, content)
		.then(stack => undefined)
		.compose(respond_response(req, res, next, {"success_code": 201}))
	;
});

server.get('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.get_stack(stack).load()
		.compose(
			respond_response(
				req, res, next,
				{"error_class": restify.errors.NotFoundError}
			)
		)
	;
});

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});

