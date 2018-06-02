var term = require('terminal-kit').terminal;
var fs = require('fs');

module.exports = download = {
    mkdirSyncRecursive : function(dir) {
        let sep = '/';

        let segments = dir.split(sep);
        let current = '';
        let i = 0;

        while (i < segments.length) {
            current = current + sep + segments[i];
            try {
                fs.statSync(current);
            } catch (e) {
                fs.mkdirSync(current);
            }

            i++;
        }
	},
	exec : async (input, raw, shell) => {

        let homeDir = shell.sessionDir+'/files';
        let currentDir = shell.pwd.replace(/\/+$/g, '')+'/';
        let requestFile = input.args[0].value;

        // If absolute path
        if(!requestFile.match(/^\//)){
            requestFile = currentDir+requestFile;
        }

        // Get realpath
        let pathInfo = await shell.php(`return pathinfo(realpath('`+requestFile+`'));`);
        let copyDir = homeDir+pathInfo.dirname;

        // Get file
    	let output = await shell.call(`ob_clean();
    		header('Content-Disposition: attachment; filename=rawfile');
    		header('Content-Type: application/octet-stream');
			header('Expires: 0');
			header('Cache-Control: must-revalidate');
			header('Pragma: public');
			echo base64_encode(file_get_contents('`+requestFile+`'));
			exit;`);

        // Create local directory
		download.mkdirSyncRecursive(copyDir);

		// Create local file
        fs.writeFile(copyDir+'/'+pathInfo.basename, output, 'base64', function (err) {
            if (err) throw err;
            term.bold.green('Saved on : '); term(copyDir+'/'+pathInfo.basename+"\n");

            shell.input();
        });
	}
};