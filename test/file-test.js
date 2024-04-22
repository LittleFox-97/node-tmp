const assert = require('node:assert')
const fs = require('node:fs')
const tmp = require('../lib/tmp')
const inbandStandardTests = require('./inband-standard')
const assertions = require('./assertions')
const childProcess = require('./child-process').genericChildProcess

// make sure that everything gets cleaned up
tmp.setGracefulCleanup()

describe('tmp', () => {
  describe('#file()', () => {
    describe('when running inband standard tests', () => {
      inbandStandardTests(true, function before(done) {
        tmp.file(this.opts, (err, name, fd, removeCallback) => {
          if (err) {
            return done(err)
          }
          this.topic = { name, fd, removeCallback }
          done()
        })
      })

      describe('with invalid tries', () => {
        it('should result in an error on negative tries', (done) => {
          tmp.file({ tries: -1 }, (err) => {
            try {
              assert.ok(err instanceof Error, 'should have failed')
            } catch (err) {
              return done(err)
            }
            done()
          })
        })

        it('should result in an error on non numeric tries', (done) => {
          tmp.file({ tries: 'nan' }, (err) => {
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
      it('on issue #182: should not replace empty postfix with ".tmp"', (done) => {
        tmp.file({ postfix: '' }, (path) => {
          try {
            assert.ok(!path.endsWith('.tmp'))
          } catch (err) {
            return done(err)
          }
          done()
        })
      })
    })

    describe('when running standard outband tests', () => {
      it('on graceful', function (done) {
        childProcess(this, 'graceful-file.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (!stderr) {
            return done(new Error('stderr expected'))
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

      it('on non graceful', function (done) {
        childProcess(this, 'non-graceful-file.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (!stderr) {
            return done(new Error('stderr expected'))
          }
          try {
            assertions.assertExists(stdout, true)
            fs.rmSync(stdout, { recursive: true })
          } catch (err) {
            return done(err)
          }
          done()
        })
      })

      it('on keep', function (done) {
        childProcess(this, 'keep-file.json', (err, stderr, stdout) => {
          if (err) {
            return done(err)
          }
          if (stderr) {
            return done(new Error(stderr))
          }
          try {
            assertions.assertExists(stdout, true)
            fs.rmSync(stdout, { recursive: true })
          } catch (err) {
            return done(err)
          }
          done()
        })
      })

      it('on unlink (keep == false)', function (done) {
        childProcess(this, 'unlink-file.json', (err, stderr, stdout) => {
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

    describe('when running issue specific outband tests', () => {
      it('on issue #115', function (done) {
        childProcess(this, 'issue115.json', (err, stderr, stdout) => {
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
