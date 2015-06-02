'use strict'

module.exports = function (options) {
  return function (files, metalsmith, done) {
    Object.keys(options).forEach(function (dest) {
      var hashOptions = options[dest]
      var file = files[hashOptions.source]
      if (file) {
        var hash = {}
        var obj = JSON.parse(file.contents.toString())
        obj.forEach(function (item) {
          var value = item[hashOptions.key]
          hash[value] = item
        })

        var json = JSON.stringify(hash, null, 2)
        files[dest] = { contents: new Buffer(json) }
      }
    })
    done()
  }
}
