
'use strict';

var extname = require('path').extname;
var Metalsmith = require('metalsmith');

var extractComments = require('./lib/comments-to-markdown');
var toJSON = require('./lib/toJSON');
var directives = require('./lib/directives.js');
var builder = require('./lib/builder.js');

var indexer = require('./lib/metalsmith-index.js');

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
    "leadsheets.index.json": {
      pattern: "**/*.ls.json",
      key: "title"
  }}))
  .build(function(err) {
    if (err) throw err;
    console.log("Done!!");
  });
