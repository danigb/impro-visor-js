
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');
var lista = require('lista');

function clean(buffer) {
  //  .replace(/\)\)$/gm, ")\n)\n")
  return buffer
    .replace(/^\/\*.*$/gm, '') // comments
    .replace(/^\s+\*.*$/gm, '') // comments
    .replace(/\/\/.*$/gm, '') // comments
    .replace(/^\s*[\r\n]/gm, '') // empty lines
    .replace(/[\r\n][ \t]{2,}/g, " ")
    .split(/[\r\n]/);
}

var directives = {
  'equiv': function(list, obj) {
    var basic = list.shift();
    obj.equiv[basic] = list;
  },
  'diatonic': function(list, obj) {
    var name = list.shift();
    obj.diatonic[name] = list;
  },
  'brick-type': function(list, obj) {
    var name = list.shift();
    var cost = +list.shift();
    obj['brick-type'][name] = {cost: cost};
  },
  'defbrick': function(list, obj) {
    console.log("brick", list);
    var name = list.shift();
    obj.defbrick[name] = {};

    var type = Array.isArray(list[0]) ? list.shift().join(' ') : 'default';
    var brick = obj.defbrick[name][type] = {};

    brick.mode = list.shift();
    brick.type = list.shift();
    brick.key = list.shift();
    brick.subBlocks = [];
    list.forEach(function(sub) {
      var type = sub.shift();
      var obj = (type == 'chord') ?
        { type: 'chord', name: sub.shift(), duration: sub.shift() } :
        { type: 'brick', name: sub.shift(), key: sub.shift(),
          duration: sub.shift() };
      brick.subBlocks.push(obj);
    });
  }
}

function parse(lines) {
  var list, name, directive;
  var obj = {};
  lines.forEach(function(line) {
    list = lista(line);
    name = list.shift();
    directive = directives[name];
    if (directive) {
      obj[name] = obj[name] || {};
      directive(list, obj);
    }
  })
  return obj;
}

function convertToJson() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      console.log(">>", file);
      var lines = clean(files[file].contents.toString());
      var obj = parse(lines);
      var json = JSON.stringify(obj, null, 2);
      files[file + ".json"] = { contents: new Buffer(json) };
      delete files[file];
    });
    done();
  }
}

console.log("Building...");
Metalsmith(__dirname)
  .source('source/dic')
  .concurrency(100)
  .use(convertToJson())
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
