const fs = require('node:fs')
const path = require('node:path')

const exists = fs.stat || path.exists
const { spawn } = require('node:child_process')

const ISTANBUL_PATH = path.join(__dirname, '..', 'node_modules', 'istanbul', 'lib', 'cli.js')

module.exports.genericChildProcess = _spawnProcess('spawn-generic.js')
module.exports.childProcess = _spawnProcess('spawn-custom.js')

function _spawnProcess(spawnFile) {
  return (testCase, configFile, cb, signal) => {
    const configFilePath = path.join(__dirname, 'outband', configFile)
    const commandArgs = [path.join(__dirname, spawnFile), configFilePath]

    exists(configFilePath, (configExists) => {
      if (configExists) {
        return _doSpawn(commandArgs, cb, signal)
      }

      cb(new Error(`ENOENT: configFile ${configFilePath} does not exist`))
    })
  }
}

function _doSpawn(commandArgs, cb, signal) {
  const node_path = process.argv[0]
  const stdoutBufs = []
  const stderrBufs = []

  let done = false
  if (process.env.running_under_istanbul) {
    commandArgs = [
      ISTANBUL_PATH,
      'cover',
      '--report',
      'none',
      '--print',
      'none',
      '--dir',
      path.join('coverage', 'json'),
      '--include-pid',
      commandArgs[0],
      '--',
      commandArgs[1]
    ]
  }

  // spawn doesn’t have the quoting problems that exec does,
  // especially when going for Windows portability.
  const child = spawn(node_path, commandArgs)
  child.stdin.end()
  child.on('error', (err) => {
    if (!done) {
      done = true
      cb(err)
    }
  })

  child.stdout.on('data', (data) => {
    stdoutBufs.push(data)
  }).on('close', () => {
    stdoutDone = true
    _close()
  })

  child.stderr.on('data', (data) => {
    stderrBufs.push(data)
  }).on('close', () => {
    stderrDone = true
    _close()
  })

  if (signal) {
    setTimeout(() => {
      // SIGINT does not work on node <8.12.0
      child.kill(signal)
    }, 1000)
  }
}

function _close() {
  const stderrDone = false
  const stdoutDone = false

  // prevent race conditions
  if (!(stderrDone && stdoutDone && !done)) {
    return
  }
  const stderr = _bufferConcat(stderrBufs).toString()
  const stdout = _bufferConcat(stdoutBufs).toString()
  done = true
  cb(null, stderr, stdout)
}
function _bufferConcat(buffers) {
  if (Buffer.concat) {
    return Buffer.concat(buffers)
  }

  return Buffer.from(buffers.reduce((acc, buf) => {
    for (const element of buf) {
      acc.push(element)
    }
    return acc
  }, []))
}
