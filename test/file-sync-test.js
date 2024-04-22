const assert = require('node:assert')
const fs = require('node:fs')
const tmp = require('../lib/tmp')
const inbandStandardTests = require('./inband-standard')
const assertions = require('./assertions')
const childProcess = require('./child-process').genericChildProcess

// make sure that everything gets cleaned up
tmp.setGracefulCleanup()

describe('tmp', () => {
  describe('#fileSync()', () => {
    describe('when running inband standard tests', () => {
      inbandStandardTests(true, function before() {
        this.topic = tmp.fileSync(this.opts)
      }, true)

      describe('with invalid tries', () => {
        it('should result in an error on negative tries', () => {
          try {
            tmp.fileSync({ tries: -1 })
            assert.fail('should have failed')
          } catch (err) {
            assert.ok(err instanceof Error)
          }
        })

        it('should result in an error on non numeric tries', () => {
          try {
            tmp.fileSync({ tries: 'nan' })
            assert.fail('should have failed')
          } catch (err) {
            assert.ok(err instanceof Error)
          }
        })
      })
    })

    describe('when running issue specific inband tests', () => {
      it('on issue #182: should not replace empty postfix with ".tmp"', () => {
        const tmpobj = tmp.fileSync({ postfix: '' })
        assert.ok(!tmpobj.name.endsWith('.tmp'))
      })
    })

    describe('when running standard outband tests', () => {
      it('on graceful', function (done) {
        childProcess(this, 'graceful-file-sync.json', (err, stderr, stdout) => {
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
        childProcess(this, 'non-graceful-file-sync.json', (err, stderr, stdout) => {
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
        childProcess(this, 'keep-file-sync.json', (err, stderr, stdout) => {
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
        childProcess(this, 'unlink-file-sync.json', (err, stderr, stdout) => {
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
        childProcess(this, 'issue115-sync.json', (err, stderr, stdout) => {
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
      it('on issue #115', function (done) {
        childProcess(this, 'issue115-sync.json', (err, stderr, stdout) => {
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
