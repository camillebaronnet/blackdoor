var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		term.clear();
		shell.input();
	}
}