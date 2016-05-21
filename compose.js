"use strict";

let fsp = require('fs-promise');

let Compose = {
	base_dir		: "/tmp",
	stacks			: {},
	_get_or_new_stack	: function(name) {
		if(name in this.stacks) {
			return this.stacks[name]
		}
		return this.stacks[name] = new Compose.Stack(name);
	},

	save_stack		: function(name, content) {
		let stack = this._get_or_new_stack(name);
		return stack.save(content);
	},

	get_stack		: function(name) {
		return this._get_or_new_stack(name);
	}
};

module.exports = Compose;

Compose.Stack = function(name, content) {
	if(name == undefined) throw "new stack with no name given";
	this.name = name;
	let promise = Promise.resolve();
	if(content != undefined) {
		promise = promise.then(data => this.save(content));
	}
	this.DONE = promise;
}

Compose.Stack.prototype = {
	save	: function(content) {
		 var stack_dir = Compose.base_dir + "/" + this.name;
		 return fsp
			.mkdir(stack_dir)
			.catch(error => {
				if (error.code == 'EEXIST') return null;
				throw error;
		 	})
			.then(result => fsp.writeFile(stack_dir + "/docker-compose.yaml", content))
			.then(data => this)
		;
	},
	load	: function() {
		var stack_file = Compose.base_dir + "/" + this.name + "/docker-compose.yaml";
		return fsp
			.readFile(stack_file, "utf-8")
			//.then(JSON.parse)
		;
	}
};
