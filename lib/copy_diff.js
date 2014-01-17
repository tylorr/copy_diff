/*
  Take in data object with following options:

    output  output path for copied files
    stdin   input stream to read for file status
    stdout  output stream to right copied files to
*/

var path = require('path'),
    domain = require('domain'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    es = require('event-stream'),
    copy_file,
    run;

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

run = function(data, callback) {

  // split input by newlines
  // only new and modified files pass the filter
  // map to filename only, don't show file status
  file_pipe = data.stdin
    .pipe(es.split())
    .pipe(es.map(function(file, cb) {
      var match = file.match(/^[AM]\s+(.+)$/);

      if (match) {
        cb(null, match[1]);
      } else {
        cb();
      }
    }));

  // Is there an output directory specified?
  if (data.output) {

    // copy each file to output directory
    file_pipe.on('data', function(file) {
      copy_file(data.output, file);
    });
  } else {

    // append new line characters and pipe to stdout
    file_pipe
      .pipe(es.map(function(file, cb) {
        cb(null, file + '\n');
      }))
      .pipe(data.stdout);
  }
};

module.exports = function(data, callback) {
  var global_domain = domain.create();

  // keep all streams in global domain and catch all errors
  global_domain.run(function() {
    run(data, callback);
  });

  global_domain.on('error', function(error) {
    callback(error);
    console.error(error);
    process.exit(1);
  });

  process.on('SIGINT', process.exit);
};
