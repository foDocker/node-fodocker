var server = require('./index.js');

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});

