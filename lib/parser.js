'use strict';

module.exports = parse;

function lines(buffer) {
  return buffer.split('\n')
    .map(function(line) { return line.trim(); })
    .filter(function(line) { return line; });
}

function directives(lines) {
  return lines.map(function(line) {
    var dir = {};
    dir.line = line;
    dir.type = /^\(.*\)$/gm.test(line) ? 'PAIR' :
      (/^\(.*$/gm.test(line) ? 'BLOCK' : (line == ')' ? 'CLOSE' : 'LIT'));

    return dir;
  });
}

function tokens(directives) {
  return directives.map(function(dir) {
    var token = { type: dir.type, key: '', value: '' };
    if(dir.type == 'PAIR' || dir.type == 'BLOCK') {
      var clean = dir.line.replace(/^\(/, '').replace(/\)$/, '');
      var first = clean.indexOf(' ');
      if (first > 0) {
        token.key = clean.slice(0, first);
        token.value = clean.substring(first + 1);
      } else {
        token.key = clean;
      }
    } else if (dir.type == 'LIT') {
      token.value = dir.line;
    }
    return token;
  });
}

function parse(buffer) {
  return tokens(directives(lines(buffer)));
}
