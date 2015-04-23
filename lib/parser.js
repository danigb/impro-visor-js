'use strict';

module.exports = parse;

function lexer(buffer) {
  var lexer = {};
  lexer.lines = buffer.split('\n').filter(function(line) { return !/^\s*$/m.test(line); })
  lexer.total = lexer.lines.length;
  lexer.current = -1;

  lexer.next = function() {
    lexer.current++;
    return lexer.lines[lexer.current];
  }

  return lexer;
}

function isList(line) {
  return line.indexOf('(') > -1 || line.indexOf(')') > -1;
}
function isComplete(line) {
  var open = (line.match(/\(/g) || []).length;
  var closed = (line.match(/\)/g) || []).length;
  return open == closed;
}

function evalPair(line) {
  var text = line.trim().slice(1, -1);
  var firstSpace = text.indexOf(' ');
  return {
    key: text.slice(0, firstSpace),
    value: text.substring(firstSpace).trim()
  };
}

function evalList(line) {
  var pair = evalPair(line);
  var args = pair.value.replace(/\(/g, "\n(").split('\n');
  var list = {};
  list.key = pair.key;
  list.value = args.shift().trim();
  list.props = {};
  args.forEach(function(pair) {
    var p = evalPair(pair);
    list.props[p.key] = p.value;
  });
  return list;
}

function parse(string, evaluator) {
  var tokens = lexer(string);
  var line;
  while(line = tokens.next()) {
    if(isList(line)) {
      while(!isComplete(line)) {
        line += tokens.next();
      }
      evaluator(line, evalList(line));
    } else {
      evaluator(line, null);
    }
  }
}
