"use strict";
let restify = require("restify");

Promise.prototype.compose = function (compose_func) {
	return compose_func(this);
}

let Utils = {
	respond_response : function(req, res, next, opts) {
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
}

module.exports = Utils;
