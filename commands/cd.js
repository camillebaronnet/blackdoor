var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let output = await shell.sh('cd ', input, ' && pwd;');
		shell.pwd = output.trim();
		shell.input();
	}
}