
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');

var parse = require('./lib/parser');
var build = require('./lib/builder')


function processFile(files, file, builder) {
  var buffer = files[file].contents.toString();
  var tokens = parse(buffer);
//  var txt = tokens.map(function(t) { return [t.type, t.key, t.value].join('|'); }).join('\n');
//  files[file + ".txt"] = { contents: new Buffer(txt) };
  var obj = builder(tokens);
  var json = JSON.stringify(obj, null, 2);
  files[file + ".json"] = { contents: new Buffer(json) };
  delete files[file];
}


function improvisor(){
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var builder = (extname(file) == '.ls') ? build.leadsheet :
        (file.indexOf('My.') > 0) ? build.vocab : null;

      if(builder) {
        processFile(files, file, builder);
      }
    });
    done();
  }
}

console.log("Build.");
Metalsmith(__dirname)
  .source('source')
  .use(improvisor())
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
