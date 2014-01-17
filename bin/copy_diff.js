#!/usr/bin/env node

var cli = require('../lib/cli'),
    argv = require('optimist')
      .alias('o', 'output')
      .alias('h', 'help')
      .argv;

// bind stdin and stdout
argv.stdin = process.stdin;
argv.stdout = process.stdout;

cli.argv(argv);
