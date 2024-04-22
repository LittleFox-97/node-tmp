const fs = require('node:fs')

module.exports.readJsonConfig = function readJsonConfig(path) {
  const contents = fs.readFileSync(path)
  return JSON.parse(contents)
}
