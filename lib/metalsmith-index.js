'use strict';

var minimatch = require('minimatch');

module.exports = function(options) {
  return function indexFiles(files, metalsmith, done) {
    Object.keys(options).forEach(function(indexFile) {
      var ndx = {};
      var pattern = options[indexFile].pattern;
      var key = options[indexFile].key;
      Object.keys(files).forEach(function(file) {
        if(minimatch(file, pattern)) {
          var obj = JSON.parse(files[file].contents.toString());
          var value = obj[key];
          value = value || file;
          ndx[value] = file;
        }
      });
      var json = JSON.stringify(ndx, null, 2);
      files[indexFile] = { contents: new Buffer(json) };
    });
    done();
  }
}
