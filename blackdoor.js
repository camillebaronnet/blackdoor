#!/usr/bin/env node
"use strict";

let ArgumentParser = require('argparse').ArgumentParser;
let parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: '-u http://exploit.test/login.php'
});

parser.addArgument([ '-u', '--url' ]);

let args = parser.parseArgs();

let term = require('terminal-kit').terminal;
let shell = require('./shell');

/*
term.inputField({}, (error , raw) => {
    term('\n');
    let input = parse(raw);
    input.forEach((expression) => {
        cmd.exec(expression, raw, this);
    });
});*/

let s = new shell();
s.init(args.url, 'dirty_password_hard_coded');
