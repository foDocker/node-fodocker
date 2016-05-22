"use strict";
let restify = require("restify");
let http = require("http");

Promise.prototype.compose = function (compose_func) {
	return compose_func(this);
}

http.ServerResponse.prototype.respond_response = function (next, opts) {
	var success_code = opts["success_code"] || 200;
	var error_class = opts["error_class"] || restify.errors.InternalServerError;
	return (promise) => {
		promise
			.then(result => {
				this.send(success_code, result);
				next();
			})
			.catch(error => {
				console.error(error);
				next(new error_class(error.message));
			})
	}
}
