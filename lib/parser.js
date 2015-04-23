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

function parsePair(line) {
  var clean = line.replace(/^\(/, '').replace(/\)$/, '');
  var first = clean.indexOf(' ');
  return {
    key: (first > 0) ? clean.slice(0, first) : clean,
    value: (first > 0) ? clean.substring(first + 1) : ""
  }
}

function parseList(line) {

}

function tokens(directives) {
  return directives.map(function(dir) {
    var token = { type: dir.type, key: '', value: '' };
    if(dir.type == 'PAIR' || dir.type == 'BLOCK') {
      var pair = parsePair(dir.line);
      var list = parseList(pair.value);
      token.key = pair.key;
      token.value = list ? list : pair.value;
    } else if (dir.type == 'LIT') {
      token.value = dir.line;
    }
    return token;
  });
}

function parse(buffer) {
  return tokens(directives(lines(buffer)));
}
