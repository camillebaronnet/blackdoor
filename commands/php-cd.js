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
        console.log(`return realpath('`+requestFile+`');`);
        let output = await shell.php(`return realpath('`+requestFile+`');`);
        if(output){
            shell.pwd = output.trim();
        }
		
		shell.input();
	}
}
