
'use strict';

var minimatch = require('minimatch');
var serialize = require('./serializer.js');
var lista = require('lista');

module.exports = function(directives) {
  return function(buffer) {
    return parse(clean(buffer), directives);
  }
}

function clean(buffer) {
  return buffer
    .replace(/^\/\*.*$/gm, '') // comments
    .replace(/^\s+\*.*$/gm, '') // comments
    .replace(/\/\/.*$/gm, '') // comments
    .replace(/^\s*[\r\n]/gm, '') // empty lines
    .replace(/[\r\n][ \t]{2,}/g, " ") // join indented lines
    .split(/[\r\n]/);
}

function parse(lines, directives) {
  var list, name, directive;
  var obj = {};
  lines.forEach(function(line) {
    list = lista(line);
    name = list.shift();
    directive = directives[name];
    directive = directive || directives['default'];
    obj[name] = obj[name] || {};
    directive(list, obj, name);
  })
  return obj;
}
