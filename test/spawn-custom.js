const path = require('node:path')
const { readJsonConfig } = require('./util')
const spawn = require('./spawn')

const config = readJsonConfig(process.argv[2])
spawn.graceful = !!config.graceful

// import the test case function and execute it
const fn = require(path.join(__dirname, 'outband', config.tc))
fn.apply(spawn)
