"use strict";

let fsp = require('fs-promise');
let exec = require('child-process-promise').exec;

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
	},

	ps		: function(name) {
		return new Compose.Stack(name).status();
	},

	stop		: function(name) {
		return new Compose.Stack(name).stop();
	},

	start		: function(name) {
		return new Compose.Stack(name).start();
	}
};

module.exports = Compose;

Compose.Stack = function(name, content) {
	if(name == undefined) throw "new stack with no name given";
	this.name = name;
	this.content = content;
}

Compose.Stack.prototype = {
	_dir	: function() {
		return Compose.base_dir + "/" + this.name;
	},
	_file	: function() {
		return this._dir() + "/docker-compose.yaml";
	},
	save	: function(content) {
		return fsp
			.mkdir(this._dir())
			.catch(error => {
				if (error.code == 'EEXIST') return null;
				throw error;
			})
			.then(result => fsp.writeFile(this._file(), this.content))
			.then(data => this)
		;
	},
	load	: function() {
		return fsp
			.readFile(this._file(), "utf-8")
			.then(content => {
				this.content = content;
				return this;
			})
		;
	},
	del	: function() {
		return fsp
			.unlink(this._file())
	},
	_env	: function() {
		return exec("eval $(docker-machine env)");
	},
	_ps	: function() {
		return exec("cd " + this._dir() + " && docker-compose ps")
			.then(result => {
				var lines = result.stdout.split("\n");
				var service_counts = {};
				for (var i=0; i < lines.length; i++) {
					var groups = lines[i].match(/^\w+?_(\w+?)_\d+\b.*\bUp\b/);
					if (groups != null) {
						var service = groups[1];
						var count = service_counts[service];
						if (count == null) {
							count = 0;
						}
						service_counts[service] = count + 1;
					}
				}
				return service_counts;
			})
		;
	},
	start	: function() {
		return this._env()
			.then(result =>
				exec(
					"cd " + this._dir() +
					" && docker-compose up -d --build --remove-orphan --no-recreate 2>&1"
				)
			)
			.then(result => this._ps())
		;
	},
	stop	: function() {
		return this._env()
			.then(result =>
				exec("cd " + this._dir() + " && docker-compose down --remove-orphan 2>&1")
			)
			.then(result => this._ps())
		;
	},
	status	: function() {
		return this._env()
			.then(result => this._ps())
		;
	}
};
