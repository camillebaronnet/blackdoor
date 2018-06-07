var AsciiTable = require('ascii-table');
var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {

        let currentDir = shell.pwd.replace(/\/+$/g, '')+'/';
        let requestFile = input.args[0].value;

        // If absolute path
        if(!requestFile.match(/^\//)){
            requestFile = currentDir+requestFile;
        }

        // Get realpath
        let output = await shell.php(`return file_get_contents(realpath('`+requestFile+`'));`);
		term(output+'\n');
		
		shell.input();
	}
}
