var restify = require("restify");
var Compose = require("./compose.js");

var server = restify.createServer();
server.use(restify.jsonBodyParser({maxBodySize: 60 * 1024}));

server.post('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	var content = req.body;
	Compose
		.save_stack(stack, content)
		.then(stack => {
			res.send(201);
			next();
		})
		.catch(error => {
			console.error(error);
			next(new restify.errors.InternalServerError(error.message));
		});
});

server.get('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	Compose
		.get_stack(stack).load()
		.then(result => {
			res.send(result);
			next();
		})
		.catch(error => {
			console.error(error);
			next(new restify.errors.NotFoundError(error.message));
		});
});

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});

