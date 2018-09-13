module.exports = function(path, cb) {
  if (!path) var path = './db.json'
  if (!cb) {
    console.error('No callback defined')
    return null
  }
  var exp = {}
  exp.path = (typeof path === 'string' ? path : path.toString ? path.toString() : './db.json')
  var fs = require('fs')
  exp.db = {}
  exp.set = function(key, val, clb) {
    var that = exp.db
    that[(typeof key === 'string' ? key : key.toString ? key.toString() : null)] = (typeof val === 'string' ? val : val.toString ? val.toString() : JSON.stringify(val) ? JSON.stringify(val) : null)
    that = JSON.stringify(that)
    that = that.replace(/(['"])((?:\\\1|.)*?)\1(?=\s*\:)/g, function(mat, c1, c2, c3) {
      if (c1 && c2) return c2; else return mat
    })
    fs.writeFile(exp.path, that, 'utf8', function(err) {
      if (err) throw err
      clb(err)
    })
  }
  exp.db = {}
  fs.readFile(exp.path, 'utf8', function(err, data) {
    if (err) throw err
    data = data.replace(/(['"])((?:\\\1|.)*?)\1|([^\W0-9"']+)/g, function(mat, c1, c2, c3) {
      if (c3) return '"' + c3 + '"'; else return mat
    })
    var dat = JSON.parse(data)
    var datk = dat.keys()
    for (var i in datk) {
      exp.db[datk[i]] = dat[datk[i]]
    }
    cb(err, exp)
    return exp
  })
}