var AsciiTable = require('ascii-table');
var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {
		let output = await shell.php('return $_SERVER;');
		let table = new AsciiTable();
		Object.keys(output).forEach((i) => {
			table.addRow(i, output[i]);
		});
		term(table+'\n');
		shell.input();
	}
}
