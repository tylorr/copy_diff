#!/usr/bin/env node

/*
Take diff as stdin and print or copy new or modified files

Input format

A new_file_path
M modified/file_path
D deleted_file        # these files are ignored

Usage: copy_diff
-h, --help      show usage
-o, --output    output directory 
*/

var path = require('path'),
    global_domain = require('domain').create(),
    fs = require('fs'),
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
    copy_file,
    file_pipe,
    run;

// if help specified show help and exit
if (argv.help) {
  optimist.showHelp();
  process.exit(0);
} 

// copy file to output directory keeping relative path
copy_file = function(out_dir, in_file) {
  var abs_out_dir = path.resolve(process.cwd(), out_dir),
      abs_out_file = path.join(abs_out_dir, in_file),
      abs_out_file_dir = path.dirname(abs_out_file);

  mkdirp(abs_out_file_dir, function(err) {
    if (err) {
      file_pipe.emit('error', new Error(err));
    } else {
      fs.createReadStream(in_file).pipe(fs.createWriteStream(abs_out_file));
    }
  });
};

// global stream domain
run = function() {
  var file_list = [];
  stdin.resume();
  stdin.setEncoding('utf8');

  file_pipe = stdin

    // split new lines
    .pipe(es.split())

    // filter by new and modified and map to filename only
    .pipe(es.map(function(file, callback) {
      var match = file.match(/^[AM]\s(.+)$/);

      if (match) {
        callback(null, match[1]);
      } else {
        callback();
      }
    }));

  // Is there an output directory specified?
  if (argv.output) {

    // copy each file to output directory
    var copy_to_output = copy_file.bind(this, argv.output);
    file_pipe.on('data', copy_to_output);
  } else {

    // append new line characters and pipe to stdout
    file_pipe
      .pipe(es.map(function(file, callback) {
        callback(null, file + '\n');
      }))
      .pipe(process.stdout);
  }
};

// keep all streams in global domain and catch all errors
global_domain.run(run);
global_domain.on('error', function(error) {
  console.error(error);
  process.exit(1);
});


