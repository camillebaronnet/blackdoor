let term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let path = '/';
		if(input.args[0]){
			path = input.args[0].value;
		}
		let output = await shell.sh('find '+path+' -perm -u=s -type f 2>/dev/null');
		term(output);
		shell.input();
	}
}
