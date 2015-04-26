
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');

function clean(buffer) {
  return buffer
    .replace(/^\/\*.*$/gm, '')
    .replace(/^\s+\*.*$/gm, '')
    .replace(/^\/\/.*$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\)\)$/gm, ")\n)\n")
    .replace(/^\s*[\r\n]/gm, '');
}

function convertToJson() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      console.log(">>", file);
      var json = clean(files[file].contents.toString());
      files[file + ".json"] = { contents: new Buffer(json) };
      delete files[file];
    });
    done();
  }
}

console.log("Building...");
Metalsmith(__dirname)
  .source('source/dic')
  .concurrency(100)
  .use(convertToJson())
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
