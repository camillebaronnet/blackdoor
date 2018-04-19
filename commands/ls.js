var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let output = await shell.sh('ls', input);
		term(output);
		shell.input();
	}
}