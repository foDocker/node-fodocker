"use strict";

let fsp = require('fs-promise');

let Compose = {
	base_dir	: "/tmp",

	save_stack	: function(name, content) {
		return new Compose.Stack(name).save(content);
	},

	get_stack	: function(name) {
		return new Compose.Stack(name).load();
	}
};

module.exports = Compose;

Compose.Stack = function(name) {
	if(name == undefined) throw "new stack with no name given";
	this.name = name;
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
		;
	}
};
