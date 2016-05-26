"use strict";
let restify = require("restify");
let http = require("http");

Promise.prototype.compose = function (compose_func) {
	return compose_func(this);
}

http.ServerResponse.prototype.handle_response = function (next, opts) {
	var success_code = opts["success_code"] || 200;
	var errors = opts["errors"] || [];
	return (promise) => {
		promise
			.then(result => {
				this.send(success_code, result);
				next();
			})
			.catch(error => {
				console.error(error);
				var error_class = restify.errors.InternalServerError;
				for (var i=0; i<errors.length; i++) {
					try {
						if (errors[i].test(error)) {
							error_class = errors[i].class;
							break;
						}
					} catch (exception) {
						console.error(
								"Error running test for error "
								+ error_class
								+ ": "
								+ exception
							)
						;
					}
				}
				next(new error_class(error.message));
			})
	}
}
