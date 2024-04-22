const assert = require('node:assert')
const os = require('node:os')
const path = require('node:path')
const tmp = require('../lib/tmp')
const inbandStandardTests = require('./name-inband-standard')

const isWindows = os.platform() === 'win32'

describe('tmp', () => {
  describe('#tmpName()', () => {
    describe('when running inband standard tests', () => {
      inbandStandardTests(function before(done) {
        tmp.tmpName(this.opts, (err, name) => {
          if (err) {
            return done(err)
          }
          this.topic = name
          done()
        })
      })

      describe('with invalid tries', () => {
        it('should result in an error on negative tries', (done) => {
          tmp.tmpName({ tries: -1 }, (err) => {
            try {
              assert.ok(err instanceof Error, 'should have failed')
            } catch (err) {
              return done(err)
            }
            done()
          })
        })

        it('should result in an error on non numeric tries', (done) => {
          tmp.tmpName({ tries: 'nan' }, (err) => {
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
      describe('on issue #176', () => {
        const origfn = os.tmpdir
        it('must fail on invalid os.tmpdir()', (done) => {
          os.tmpdir = () => undefined
          tmp.tmpName((err) => {
            try {
              assert.ok(err instanceof Error, 'should have failed')
            } catch (err) {
              return done(err)
            } finally {
              os.tmpdir = origfn
            }
            done()
          })
        })
      })
      describe('on issue #268', () => {
        const origfn = os.tmpdir
        it(`should not alter ${isWindows ? 'invalid' : 'valid'} path on os.tmpdir() returning path that includes double quotes`, (done) => {
          const tmpdir = isWindows ? '"C:\\Temp With Spaces"' : '"/tmp with spaces"'
          os.tmpdir = () => tmpdir
          tmp.tmpName((name) => {
            const index = name.indexOf(path.sep + tmpdir + path.sep)
            try {
              assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`)
            } catch (err) {
              return done(err)
            } finally {
              os.tmpdir = origfn
            }
            done()
          })
        })
        it('should not alter valid path on os.tmpdir() returning path that includes single quotes', (done) => {
          const tmpdir = isWindows ? '\'C:\\Temp With Spaces\'' : '\'/tmp with spaces\''
          os.tmpdir = () => tmpdir
          tmp.tmpName((name) => {
            const index = name.indexOf(path.sep + tmpdir + path.sep)
            try {
              assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`)
            } catch (err) {
              return done(err)
            } finally {
              os.tmpdir = origfn
            }
            done()
          })
        })
      })
    })

    describe('when running standard outband tests', () => {
    })

    describe('when running issue specific outband tests', () => {
    })
  })
})
