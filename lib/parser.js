'use strict';

module.exports = parse;

function evalPair(object, line) {
  var tokens = line.replace(/[\(\)]/g, '').split(' ');
  console.log("PAIR", tokens);
  object[tokens.shift()] = tokens.join(' ');
}

function evalNested(line) {
  var e = { type: '', obj: {}};

  var tokens = line.slice(1, -1).split('(');
  var head = tokens.shift().split(' ');
  e.type = head[0];
  e.name = head[1];
  tokens.forEach(function(token) {
    evalPair(e.obj, token);
  });
  return e;
}

function parse(string) {
  var object = {};
  var part;
  string.split(" ").forEach(function(line) {
    if (line[0] = '(') {
      if(line.indexOf('style') == 1)
    }
  }
    if(!line.search(/\([^(]+\)/)) {
      evalPair(object, line);
    } else if (line.indexOf("(") == 0) {
      var e = evalNested(line);
      if (e.type == 'style') {
        object.styles = {};
        object.styles[e.name] = e.obj;
      } else if(e.type == 'part') {
        part = e.obj;
        console.log("PART!", part);
        object.parts = object.parts || {};
        object.parts[part['type']] = part;
        delete part['type'];
      } else if(e.type == 'section') {
        console.log("SECTION", object, part, e);
        part['section'] = e.obj;
      }
    } else {
      part['seq'] = part['seq'] || "";
      part['seq'] = part['seq'] + line;
    }
  });
  return object;
}
