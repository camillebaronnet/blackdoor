var term = require('terminal-kit').terminal;

module.exports = {
    exec : async (input, raw, shell) => {
        term(shell.history.join('\n')+'\n');
        shell.input();
    }
}