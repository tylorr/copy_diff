#!/usr/bin/env node

var cli = require('../lib/cli'),
    argv = require('optimist')
      .alias('o', 'output')
      .alias('h', 'help')
      .argv;

cli.argv(argv);
