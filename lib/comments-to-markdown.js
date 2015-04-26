'use strict';

module.exports = extractComments;

function split(buffer) {
  return buffer.split('\n').filter(function(line) {
    return /^([\/ ]\*).*/.test(line);
  });
}

function parse(lines) {
  return lines.map(function(line) {
    return line.replace(/\/\*|\s\*\s|\*\//, '');
  }).join('\n');
}

function extractComments() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var lines = split(files[file].contents.toString());
      var md = parse(lines);
      if (md != '') {
        files[file + '.md'] = { contents: new Buffer(md) };
      }
    });
    done();
  }
}
