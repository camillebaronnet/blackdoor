var AsciiTable = require('ascii-table');
var term = require('terminal-kit').terminal;

module.exports = {
	exec : async (input, raw, shell) => {



        const response = await shell.call(`ob_clean();
            ob_start();

            `+input.args[0].value+`;
            $value = ob_get_contents();
            ob_end_clean();

            header('Content-Type: application/json');
            echo json_encode($value);

            exit;`);

        term(response+'\n');
		
		shell.input();
	}
}
