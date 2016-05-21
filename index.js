var restify = require("restify");
var Compose = require("./compose.js");

var compose = new Compose();

var server = restify.createServer();
server.use(restify.jsonBodyParser({maxBodySize: 60 * 1024}));

server.post('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	var content = req.body;
	compose
		.save_stack(
			stack,
			content
		)
		.then(result => {
			res.send(201);
			next();
		})
		.catch(error => {
			console.log(error);
			res.send(500);
			next();
		})
	;
});

server.get('/stacks/:stack', function(req, res, next) {
	var stack = req.params.stack;
	compose
		.get_stack(
			stack
		)
		.then(result => {
			res.send(result);
			next();
		})
		.catch(error => {
			console.log(error);
			res.send(500);
			next();
		})
	;
});

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});

