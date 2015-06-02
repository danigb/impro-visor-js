module.exports = function (tester, path) {
  return function (files, metalsmith, done) {
    var index = {}
    Object.keys(files).forEach(function (file) {
      if (tester.test(file)) {
        var name = file.substring(file.lastIndexOf('/') + 1)
        var content = JSON.parse(files[file].contents.toString())
        var result = process(name, content)
        var json = JSON.stringify(result, null, 2)
        files[path + '/' + name] = { contents: new Buffer(json) }
        index[result.title] = path + '/' + name
      }
    })
    files[path + '/' + tester.toString().slice(1, -1) + '.json'] = JSON.stringify(index, null, 2)
    done()
  }
}

function process (name, contents) {
  var obj = {}

  obj.title = contents.title
  obj.composer = contents.composer
  obj.meter = contents.meter.replace(' ', '/')
  obj.key = contents.key
  obj.tempo = contents.tempo
  obj.parts = {}

  contents.parts.forEach(function (part, index) {
    if (part.type === 'chords') {
      obj.parts['chords'] = part.lit.replace(/\|\s*/g, '| ').replace(/\//g, '_')
    } else {
      var key = part.title !== '' ? part.title : part.type + index
      // obj.parts['_' + key] = part.lit
      obj.parts[key] = part.lit
        .replace(/(\d)([a-gr])/g, function (m, d, n) {
          return d + ' ' + n
        })
        .replace(/\/3/g, 't')
        .replace(/([a-gr]b{0,2}#{0,2})([+]{0,5}[-]{0,5})/g, function (m, note, octave) {
          return note + octave + '/'
        })
    }
  })

  return obj
}
