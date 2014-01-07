#!/usr/bin/env node

var path = require('path'),
    mkdirp = require('mkdirp'),
    optimist = require('optimist'),
    es = require('event-stream'),
    argv = optimist
      .usage('Usage: $0')
      .alias('o', 'output')
      .describe('o', 'Output path for modified files')
      .alias('h', 'help')
      .describe('h', 'Print this usage')
      .argv,
    
    stdin = process.stdin,
    copy_files,
    print_files,
    filter_files;

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

var file_list = [];
stdin.resume();
stdin.setEncoding('utf8');

var file_pipe = stdin
  .pipe(es.split())
  .pipe(es.map(function(file, callback) {
    var match = file.match(/^[AM]\s(.+)$/);

    if (match) {
      callback(null, match[1]);
    } else {
      callback();
    }
  }));

if (argv.output) {

} else {
  file_pipe
    .pipe(es.map(function(file, callback) {
      callback(null, file + '\n');
    }))
    .pipe(process.stdout);
}
