var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let output = await shell.sh('find / -perm -u=s -type f 2>/dev/null', input);
		term(output);
		shell.input();
	}
}
