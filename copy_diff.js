#!/usr/bin/env node

var mkdirp = require('mkdirp'),
    stdin = process.stdin;

stdin.setEncoding('utf8');
stdin.on('data', function(data) {
  console.log(data);
});
