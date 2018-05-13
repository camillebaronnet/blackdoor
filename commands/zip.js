var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let output = await shell.sh('zip', input);
		term(output);
		shell.input();
	}
}