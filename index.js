
'use strict';

var parse = require('./lib/parser.js');
var extname = require('path').extname;
var Metalsmith = require('metalsmith');

function leadsheets() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      if ('.ls' == extname(file)) {
        var name = file.slice(0, -3);
        console.log("LEAD", name);
        var contents = files[file].contents.toString();
        //var object = parse(contents);
        //var repr = JSON.stringify(object, null, 2);
        var repr = parse.clean(contents);
        files[name + ".txt"] = {
          contents: new Buffer(repr)
        }
        delete files[file];
      }
    });
    done();
  }
}

console.log("Build.");
Metalsmith(__dirname)
  .source('source')
  .source('source/leadsheets/transcriptions/KennyGarrett')
  .use(leadsheets())
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
