#!/usr/bin/env node

var cli = require('../lib/cli'),
    argv = require('optimist')
      .alias('o', 'output')
      .alias('h', 'help')
      .argv;

// bind and start stdin
argv.stdin = process.stdin;
argv.stdin.resume();
argv.stdin.setEncoding('utf8');

// bind stdout
argv.stdout = process.stdout;

cli.argv(argv);
