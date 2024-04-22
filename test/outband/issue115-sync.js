const fs = require('node:fs')

module.exports = function (result) {
  fs.closeSync(result.fd)
  result.removeCallback()
  this.out(result.name, this.exit)
}
