"use strict";

let fsp = require('fs-promise');

let Compose = {
	base_dir	: "/tmp",

	save_stack	: function(name, content) {
		return new Compose.Stack(name, content).save();
	},

	get_stack	: function(name) {
		return new Compose.Stack(name).load();
	},

	del_stack	: function(name) {
		return new Compose.Stack(name).del();
	}
};

module.exports = Compose;

Compose.Stack = function(name, content) {
	if(name == undefined) throw "new stack with no name given";
	this.name = name;
	this.content = content;
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
			.then(result => fsp.writeFile(stack_dir + "/docker-compose.yaml", this.content))
			.then(data => this)
		;
	},
	load	: function() {
		var stack_file = Compose.base_dir + "/" + this.name + "/docker-compose.yaml";
		return fsp
			.readFile(stack_file, "utf-8")
			.then(content => {
				this.content = content;
				return this;
			})
		;
	},
	del	: function() {
		var stack_file = Compose.base_dir + "/" + this.name + "/docker-compose.yaml";
		return fsp
			.unlink(stack_file)
	}
};
