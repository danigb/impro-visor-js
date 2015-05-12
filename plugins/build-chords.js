var teoria = require('teoria');

module.exports = function(files, metalsmith, done) {
  var obj = JSON.parse(files['chords-impro.json'].contents.toString());
  var clean = cleanChords(obj);
  files['chords.json'] = serialize(clean, 2);
  var teoria = teorizeChords(clean);
  files['chords-teoria.json'] = serialize(teoria);
  done();
}

function teorizeChords(chords) {
  var dest = {};
  for (var name in chords) {
    var src = chords[name];
    var noKeyName = name.toString().substring(1);
    var chord = dest["X" + noKeyName] = {};

    if(src.family) chord.family = src.family;
    if(src.same) chord.same = src.same.replace(/C/g, 'X');
    if(src.pronounce) chord.pronounce = src.pronounce.replace(/C\s*/g, '');
    var key = src.key || 'c';
    var root = teoria.note(key + "8");
    if(src.spell) chord.spell = intervals(root, src.spell);
    if(src.color) chord.color = intervals(root, src.color);
    if(src.priority) chord.priority = intervals(root, src.priority);
    if(src.approach) {
      chord.approach = {};
      for(var note in src.approach) {
        var i = teoria.interval(root, teoria.note(note)).toString();
        chord.approach[i] = intervals(root, src.approach[note]);
      }
    }
    if(src.voicings) {
      chord.voicings = {};
      // special case for CNote
      if(src.voicings.all) {
        src.voicings['A'] = src.voicings.all[0];
        src.voicings['B'] = src.voicings.all[1];
        delete src.voicings.all;
      }

      for (var name in src.voicings) {
        var srcV = src.voicings[name];
        var voicing = chord.voicings[name] = {};
        voicing.type = srcV.type;
        voicing.notes = intervals(root, srcV.notes);
        if(srcV.extension != "") voicing = srcV.extension;
      }
    }
    if (src.scales) {
      chord.scales = {};
      for(var note in src.scales) {
        var i;
        try {
          r = teoria.note('C');
          i = teoria.interval(r, teoria.note(note)).toString();
        } catch(e) { i = "ERR: " + note; }
        chord.scales[i] = src.scales[note];
      }
    }
    if (src.avoid) {
      chord.avoid = intervals(root, src.avoid);
    }
    if (src.extensions) {
      chord.extensions = src.extensions.replace(/C/g, 'X');
    }
    if (src.substitute) {
      chord.substitute = src.substitute.replace(/C/g, 'X');
    }
  }
  return dest;
}

function intervals(root, notes) {
  var i;
  return notes.trim().split(' ').map(function(note) {

    var m = /([a-g][#b]*)([+-]+)8/.exec(note);
    if (m) {
      var name = m[1];
      var oct = m[2];
      if(oct == '+') oct = 9;
      else if(oct == '++') oct = 10;
      else if(oct == '-') oct = 7;
      else if(oct == '--') oct = 10;
      note = name + oct;
    }

    try { i = teoria.interval(root, teoria.note(note)); }
    catch(e) { i = "ERR: " + note };
    return i.toString();
  });
}

function cleanChords(obj) {
  for(var name in obj) {
    var chord = obj[name];
    delete chord.name;
    if(chord.pronounce == "") delete chord.pronounce;
    if(chord.voicings) {
      chord.voicings = chord.voicings[0];
    }
    if(chord.scales) {
      chord.scales = chord.scales[0];
    }
  }
  return obj;
}

function serialize(obj, indent) {
  var json = indent ? JSON.stringify(obj, null, indent) :
    JSON.stringify(obj);
  return { contents: new Buffer(json) };
}
