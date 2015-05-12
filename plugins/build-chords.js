module.exports = function(files, metalsmith, done) {
  var obj = JSON.parse(files['chords-impro.json'].contents.toString());
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
  var json = JSON.stringify(obj, null, 2);
  files['chords.json'] = { contents: new Buffer(json) };
  done();
}
