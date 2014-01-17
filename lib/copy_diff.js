// #!/usr/bin/env node

// /*
// Take diff as stdin and print or copy new or modified files

// Input format

// A new_file_path
// M modified/file_path
// D deleted_file        # these files are ignored

// Usage: copy_diff
// -h, --help               show usage
// -o, --output <directory> output directory
// */

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
    .pipe(es.map(function(file, callback) {
      var match = file.match(/^[AM]\s+(.+)$/);

      if (match) {
        callback(null, match[1]);
      } else {
        callback();
      }
    }));

  // Is there an output directory specified?
  if (data.output) {

    // copy each file to output directory
    var copy_to_output = copy_file.bind(this, data.output);
    file_pipe.on('data', copy_to_output);
  } else {

    // append new line characters and pipe to stdout
    file_pipe
      .pipe(es.map(function(file, callback) {
        callback(null, file + '\n');
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
    console.error(error);
    process.exit(1);
  });

  process.on('SIGINT', process.exit);
};
