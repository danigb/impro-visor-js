
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');

var extractComments = require('./lib/comments-to-markdown');
var toJSON = require('./lib/toJSON');
var directives = require('./lib/directives.js');
var builder = require('./lib/builder.js');

var indexer = require('./lib/metalsmith-index.js');
var arrayToHash = require('./lib/array-to-hash.js');

var noFile = function() {
  return {};
}

console.log("Building...");
Metalsmith(__dirname)
  .source('source')
  .concurrency(100)
  .use(extractComments())
  .use(toJSON({
    '**/My.dictionary': directives(require('./lib/dictio.js')),
    '**/My.voc': builder('vocab'),
    '**/My.substitutions': builder('vocab'),
    '**/*.ls': builder('leadsheet'),
    '**/My.prefs': noFile,
    '**/My.themes': noFile
  }))
  .use(indexer({
    "leadsheets-index.json": {
      pattern: "**/*.ls.json",
      key: "title"
  }}))
  .use(arrayToHash({
    "scales.json": {
      source: "vocab/My.voc.scales.json",
      key: "name"
    },
    "chords.json": {
      source: "vocab/My.voc.chords.json",
      key: "name"
    }
  }))
  .use(function(files, metalsmith, done) {
    var obj = JSON.parse(files['chords.json'].contents.toString());
    for(var name in obj) {
      var chord = obj[name];
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
  })
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
