
'use strict';

var Metalsmith = require('metalsmith');

var extractComments = require('./plugins/comments-to-markdown');
var toJSON = require('./plugins/toJSON');
var directives = require('./plugins/directives.js');
var builder = require('./plugins/builder.js');

var indexer = require('./plugins/metalsmith-index.js');
var arrayToHash = require('./plugins/array-to-hash.js');

var noFile = function () {
  return {};
}

console.log('Building...');
Metalsmith(__dirname)
  .source('source')
  .concurrency(100)
  .use(extractComments())
  .use(toJSON({
    '**/My.dictionary': directives(require('./plugins/dictio.js')),
    '**/My.voc': builder('vocab'),
    '**/My.substitutions': builder('vocab'),
    '**/*.ls': builder('leadsheet'),
    '**/My.prefs': noFile,
    '**/My.themes': noFile
  }))
  .use(indexer({
    'leadsheets-index.json': {
      pattern: '**/*.ls.json',
      key: 'title'
  }}))
  .use(arrayToHash({
    'scales-impro.json': {
      source: 'vocab/My.voc.scales.json',
      key: 'name'
    },
    'chords-impro.json': {
      source: 'vocab/My.voc.chords.json',
      key: 'name'
    }
  }))
  .use(require('./plugins/build-scales.js'))
  .use(require('./plugins/build-chords.js'))
  .use(require('./plugins/build-leadsheets.js')(/changes/, 'changes'))
  .use(require('./plugins/build-leadsheets.js')(/insights/, 'changes'))
  .use(require('./plugins/build-leadsheets.js')(/transcriptions/, 'transcriptions'))
  .build(function (err) {
    if (err) throw err;
    console.log('Done!!');
  });
