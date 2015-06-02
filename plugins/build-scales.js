module.exports = function (files, metalsmith, done) {
  var source = JSON.parse(files['scales-impro.json'].contents.toString())
  var clean = buildClean(source)
  var teo = buildTeoria(clean)
  files['scales.json'] = serialize(clean)
  files['scales-teoria.json'] = serialize(teo)
  var scales = splitScales(teo)
  files['scales-jazz.json'] = serialize(scales.jazz.spell)
  files['scales-jazz-alias.json'] = serialize(scales.jazz.alias)
  files['scales-esoteric.json'] = serialize(scales.esoteric.spell)
  files['scales-esoteric-alias.json'] = serialize(scales.esoteric.alias)
  done()
}

function splitScales (teoria) {
  var scales = { jazz: { spell: {}, alias: {}}, esoteric: {spell: {}, alias: {}}}
  for (var name in teoria) {
    var group = isJazzName(name) ? scales.jazz : scales.esoteric
    if (teoria[name].spell) {
      group.spell[name] = teoria[name].spell
    } else if (teoria[name].same) {
      group.alias[name] = teoria[name].same
    } else {
      throw Error('Invalid scale: ' + name)
    }
  }
  return scales
}

var JAZZ = "major minor dominant dimished bebop ionian dorian lydian mixolydian aeolian phrygian locrian melodic whole".split(' ')
function isJazzName (name) {
  if (name == 'altered' || name == 'blues' || name == 'pentatonic' ) return true
  for (var jazz of JAZZ) {
    if (name.indexOf(jazz) >= 0) return true
  }
  return false
}

function buildTeoria(source) {
  var scale
  scales = {}
  for(var name in source) {
    scale = scales[name.substring(2)] = source[name]
  }
  return scales
}

function serialize(obj) {
  var json = JSON.stringify(obj, null, 0)
  return { contents: new Buffer(json) }
}

var teoria = require('teoria')
function buildClean(source) {
  for(var name in source) {
    var scale = source[name]
    delete scale.name
    if(scale.spell) {
      var notes = scale.spell.trim().split(' ')
      if(notes[0] == notes[notes.length - 1]) {
        notes.pop()
      }
      notes = notes.map(function(n) {
        return teoria.note(n)
      })
      var first = notes[0]
      notes = notes.map(function(note) {
        return teoria.interval(first, note).toString()
      })

      scale.spell = notes
    }
  }
  return source
}
