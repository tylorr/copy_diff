var path = require('path'),
    fs = require('fs');

module.exports = function(argv, callback) {
  var basepath = path.join(__dirname, '..', '..', 'doc'),
      filepath = 'help.txt',
      data;

  filepath = path.join(basepath, filepath);

  data = fs.readFileSync(filepath, 'utf8');
  data = data.trim().replace(/\$0/g, argv.$0);

  console.log('\n' + data + '\n');
  callback(null);
};
