vows = require('vows');
assert = require('assert');

Chord = require('../lib/chord.js');

vows.describe('Chord').addBatch({
  "load chords": {
    "by name": function() {
      chord = Chord.find("Cbass");
      assert.equal(chord.name, "Cbass");
    },
    "by alias": function() {
      chord = Chord.find("CMajor");
      assert.equal(chord.name, "");
    }
  }
}).export(module);
