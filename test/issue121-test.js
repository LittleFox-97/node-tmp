const os = require('node:os')
const assertions = require('./assertions')
const { childProcess } = require('./child-process')

const testCases = [
  'SIGINT',
  'SIGTERM'
]

// skip tests on win32
const isWindows = os.platform() === 'win32'
const tfunc = isWindows ? xit : it

describe('tmp', () => {
  describe('issue121 - clean up on terminating signals', () => {
    for (const tc of testCases) {
      tfunc(`for signal ${tc}`, function (done) {
        // increase timeout so that the child process may terminate in time
        this.timeout(5000)
        issue121Tests(tc)(done)
      })
    }
  })
})

function issue121Tests(signal) {
  return function (done) {
    childProcess(this, 'issue121.json', (err, stderr, stdout) => {
      if (err) {
        return done(err)
      } else if (stderr) {
        return done(new Error(stderr))
      }

      assertions.assertDoesNotExist(stdout)
      done()
    }, signal)
  }
}
