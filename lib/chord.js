'use strict';

var data = require('./chords.json');

function Chord(name, data) {
  this.name = name;
  this.data = data;
}

Chord.find = function(name) {
  var chord = data[name];
  while(chord && chord.same) {
    name = chord.same;
    chord = data[name];
  }
  return new Chord(name, chord);
}

module.exports = Chord;
