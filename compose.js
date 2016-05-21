module.exports = Compose;

var fsp = require('fs-promise');

function Compose() {
	this.base_dir = "/tmp";
}

Compose.prototype = {
	save_stack: function(name, content) {
		var stack_dir = this.base_dir + "/" + name;
		return fsp.mkdir(
				stack_dir
			).catch(error => {
				if (error.code == 'EEXIST') return null;
				throw error;
			}).then(result =>
				fsp.writeFile(stack_dir + "/docker-compose.yaml", content)
			)
	}
}
