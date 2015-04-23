
'use strict';

var parse = require('./lib/parser.js');
var extname = require('path').extname;
var Metalsmith = require('metalsmith');

function sheetBuilder(parent) {
  var part = null;
  return function(line, object) {
    console.log("MIERDA", line, object);
    if(object) {
      if(object.key == 'style') {
        parent.styles = parent.styles || {};
        parent.styles[object.value] = object.props;
      } else if(object.key == 'part') {
        part = object.props;
        parent.parts = parent.parts || [];
        parent.parts.push(part);
      } else if(object.key == 'section') {
        part.section = object.props;
      } else {
        parent[object.key] = object.value;
      }
    } else {
      part.literal = part.literal || "";
      part.literal += line;
    }
  }
}


function leadsheets() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      if ('.ls' == extname(file)) {
        var name = file.slice(0, -3);
        console.log("PROCESSING: " + name);
        var contents = files[file].contents.toString();
        var obj = {};
        parse(contents, sheetBuilder(obj));
        var json = JSON.stringify(obj, null, 2);
        files[name + ".json"] = {
          contents: new Buffer(json)
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
