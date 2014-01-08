#!/usr/bin/env node

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

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
} 

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

run = function() {
  var file_list = [];
  stdin.resume();
  stdin.setEncoding('utf8');

  file_pipe = stdin
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
    var copy_to_output = copy_file.bind(this, argv.output);
    file_pipe.on('data', copy_to_output);
  } else {
    file_pipe
      .pipe(es.map(function(file, callback) {
        callback(null, file + '\n');
      }))
      .pipe(process.stdout);
  }
};

global_domain.run(run);

global_domain.on('error', function(error) {
  console.error(error);
  process.exit(1);
});


