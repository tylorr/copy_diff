var copy_diff = require('../copy_diff');

module.exports = function(argv, callback) {
  callback = callback || function() {};

  if (argv.help) {
    this.help.call(this, argv, callback);
    return;
  }

  argv.stdin.resume();
  argv.stdin.setEncoding('utf8');

  var data = {};
  for (var key in argv) {
    if (key !== '_') {
      data[key] = argv[key];
    }
  }

  copy_diff(data, callback);
};
