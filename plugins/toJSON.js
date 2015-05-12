'use strict';

var minimatch = require('minimatch');
var serialize = require('./serializer.js');

module.exports = fileToJSON;

function fileToJSON(options){
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      Object.keys(options).forEach(function(pattern) {
        if(minimatch(file, pattern)) {
          console.log("PROCESSING", file, pattern);
          var buffer = files[file].contents.toString();
          var obj = options[pattern](buffer);
          serialize(file, obj, files);
        }
      });
    });
    done();
  }
}
