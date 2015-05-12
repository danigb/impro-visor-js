module.exports = function(files, metalsmith, done) {
  var source = JSON.parse(files['scales-impro.json'].contents.toString());
  var clean = buildClean(source);
  var teo = buildTeoria(clean);
  files['scales.json'] = serialize(clean);
  files['scales-teoria.json'] = serialize(teo);
  done();
}

function buildTeoria(source) {
  var scale;
  scales = {};
  for(var name in source) {
    scale = scales[name.substring(2)] = source[name];
  }
  return scales;
}

function serialize(obj) {
  var json = JSON.stringify(obj, null, 0);
  return { contents: new Buffer(json) };
}

var teoria = require('teoria');
function buildClean(source) {
  for(var name in source) {
    var scale = source[name];
    delete scale.name;
    if(scale.spell) {
      var notes = scale.spell.trim().split(' ');
      if(notes[0] == notes[notes.length - 1]) {
        notes.pop();
      }
      notes = notes.map(function(n) {
        return teoria.note(n);
      });
      var first = notes[0];
      notes = notes.map(function(note) {
        return teoria.interval(first, note).toString();
      });

      scale.spell = notes;
    }
  }
  return source;
}
