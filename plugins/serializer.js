'use strict';

module.exports = serialize;

function serialize(file, obj, files) {
  var keys = Object.keys(obj);
  if (keys.length < 9) {
    keys.forEach(function(key) {
      var json = JSON.stringify(obj[key], null, 2);
      files[file + '.' + key + ".json"] = { contents: new Buffer(json) };
    });
  } else if (keys == 0) {
  } else {
    var json = JSON.stringify(obj, null, 2);
    files[file + ".json"] = { contents: new Buffer(json) };
  }
  delete files[file];
}
