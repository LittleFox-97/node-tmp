const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const tmp = require('../lib/tmp')
const inbandStandardTests = require('./inband-standard')
const childProcess = require('./child-process').genericChildProcess
const assertions = require('./assertions')

// make sure that everything gets cleaned up
tmp.setGracefulCleanup()

describe('tmp', () => {
  describe('#dir()', () => {
    describe('when running inband standard tests', () => {
      inbandStandardTests(false, function before(done) {
        tmp.dir(this.opts, (err, name, removeCallback) => {
          if (err) {
            return done(err)
          }
          this.topic = { name, removeCallback }
          done()
        })
      })

      describe('with invalid tries', () => {
        it('should result in an error on negative tries', (done) => {
          tmp.dir({ tries: -1 }, (err) => {
            try {
              assert.ok(err instanceof Error, 'should have failed')
            } catch (err) {
              return done(err)
            }
            done()
          })
        })

        it('should result in an error on non numeric tries', (done) => {
          tmp.dir({ tries: 'nan' }, (err) => {
            try {
              assert.ok(err instanceof Error, 'should have failed')
            } catch (err) {
              return done(err)
            }
            done()
          })
        })
      })
    })

    describe('when running issue specific inband tests', () => {
    })

    describe('when running standard outband tests', () => {
      it('on graceful cleanup', function (done) {
        childProcess(this, 'graceful-dir.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (!stderr) {
            return done(new Error('stderr expected'))
          }
          try {
            assertions.assertDoesNotExist(stdout)
          } catch (err) {
            // fs.rmSync(stdout, { recursive: true });
            return done(err)
          }
          done()
        })
      })

      it('on non graceful cleanup', function (done) {
        childProcess(this, 'non-graceful-dir.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (!stderr) {
            return done(new Error('stderr expected'))
          }
          try {
            assertions.assertExists(stdout)
            fs.rmSync(stdout, { recursive: true })
          } catch (err) {
            return done(err)
          }
          done()
        })
      })

      it('on keep', function (done) {
        childProcess(this, 'keep-dir.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertExists(stdout)
            fs.rmSync(stdout, { recursive: true })
          } catch (err) {
            return done(err)
          }
          done()
        })
      })

      it('on unlink (keep == false)', function (done) {
        childProcess(this, 'unlink-dir.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertDoesNotExist(stdout)
          } catch (err) {
            fs.rmSync(stdout, { recursive: true })
            return done(err)
          }
          done()
        })
      })

      it('on unsafe cleanup', function (done) {
        childProcess(this, 'unsafe.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertDoesNotExist(stdout)
          } catch (err) {
            fs.rmSync(stdout, { recursive: true })
            return done(err)
          }
          done()
        })
      })

      it('on non unsafe cleanup', function (done) {
        childProcess(this, 'non-unsafe.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertExists(stdout)
            assertions.assertExists(path.join(stdout, 'should-be-removed.file'), true)
            if (process.platform === 'win32') {
              assertions.assertExists(path.join(stdout, 'symlinkme-target'), true)
            } else {
              assertions.assertExists(path.join(stdout, 'symlinkme-target'))
            }
            fs.rmSync(stdout, { recursive: true })
          } catch (err) {
            return done(err)
          }
          done()
        })
      })
    })

    describe('when running issue specific outband tests', () => {
      it('on issue #62', function (done) {
        childProcess(this, 'issue62.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertDoesNotExist(stdout)
          } catch (err) {
            fs.rmSync(stdout, { recursive: true })
            return done(err)
          }
          done()
        })
      })
    })
  })
})
