
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');

var parse = require('./lib/parser');
var build = require('./lib/builder')


function serialize(files, file, obj) {
  var json;

  if (file.indexOf('My.voc') >= 0) {
    var keys = Object.keys(obj);
    keys.forEach(function(key) {
      json = JSON.stringify(obj[key], null, 2);
      files[file + "." + key + ".json"] = { contents: new Buffer(json) };
    });
  } else {
    json = JSON.stringify(obj, null, 2);
    files[file + ".json"] = { contents: new Buffer(json) };
  }

}

function processFile(files, file, builder, serializer) {
  console.log("PROCESS", file);
  var buffer = files[file].contents.toString();
  var tokens = parse(buffer);
//  var txt = tokens.map(function(t) { return [t.type, t.key, t.value].join('|'); }).join('\n');
//  files[file + ".txt"] = { contents: new Buffer(txt) };
  var obj = builder(tokens);
  serialize(files, file, obj);
  delete files[file];
}


function improvisor(){
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var builder;
      if (extname(file) == '.ls') {
        builder = build.leadsheet;
      } else if (file.indexOf('My.') > 0) {
        builder = build.vocab;
      }

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
