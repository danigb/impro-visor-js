
'use strict';

/*
 * My.dictionary directives
 */
module.exports = {
  'default': function(list, obj, name) {
    throw "Dictionary directive " + name + "not found" + list.join(' ');
  },
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
