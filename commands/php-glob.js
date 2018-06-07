var AsciiTable = require('ascii-table');
var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {

        let path = '*';
        if(input.args[0]){
            path = input.args[0].value;
        }

		let output = await shell.php('return glob("'+path+'");');
		let table = new AsciiTable();
		Object.keys(output).forEach((i) => {
			table.addRow(i, output[i]);
		});
		term(table+'\n');
		shell.input();
	}
}
