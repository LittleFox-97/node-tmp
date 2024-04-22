const path = require('node:path')
const tmp = require('../lib/tmp')
const { readJsonConfig } = require('./util')
const spawn = require('./spawn')

const config = readJsonConfig(process.argv[2])
spawn.graceful = !!config.graceful

let fnUnderTest = null

if (config.async) {
  fnUnderTest = (config.file) ? tmp.file : tmp.dir
} else {
  fnUnderTest = (config.file) ? tmp.fileSync : tmp.dirSync
}

// make sure that we have a SIGINT handler so CTRL-C the test suite
// will not leave anything behind
process.on('SIGINT', process.exit)

// do we test against tmp doing a graceful cleanup?
if (config.graceful) {
  tmp.setGracefulCleanup()
}

// import the test case function and execute it
const fn = require(path.join(__dirname, 'outband', config.tc))
if (config.async) {
  fnUnderTest(config.options, (err, name, fdOrCallback, cb) => {
    if (err) {
      spawn.err(err)
      return
    }
    let result = null
    result = config.file ? { name, fd: fdOrCallback, removeCallback: cb } : { name, removeCallback: fdOrCallback }
    fn.apply(spawn, [result, tmp])
  })
} else {
  fn.apply(spawn, [fnUnderTest(config.options), tmp])
}
