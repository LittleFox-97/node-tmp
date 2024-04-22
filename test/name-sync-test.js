const assert = require('node:assert')
const os = require('node:os')
const path = require('node:path')
const tmp = require('../lib/tmp')
const inbandStandardTests = require('./name-inband-standard')

const isWindows = os.platform() === 'win32'

describe('tmp', () => {
  describe('#tmpNameSync()', () => {
    describe('when running inband standard tests', () => {
      inbandStandardTests(function before() {
        this.topic = tmp.tmpNameSync(this.opts)
      })

      describe('with invalid tries', () => {
        it('should result in an error on negative tries', () => {
          try {
            tmp.tmpNameSync({ tries: -1 })
            assert.fail('should have failed')
          } catch (err) {
            assert.ok(err instanceof Error)
          }
        })
        it('should result in an error on non numeric tries', () => {
          try {
            tmp.tmpNameSync({ tries: 'nan' })
            assert.fail('should have failed')
          } catch (err) {
            assert.ok(err instanceof Error)
          }
        })
      })
    })

    describe('when running issue specific inband tests', () => {
      describe('on issue #176', () => {
        const origfn = os.tmpdir
        it('must fail on invalid os.tmpdir()', () => {
          os.tmpdir = () => undefined
          try {
            tmp.tmpNameSync()
            assert.fail('should have failed')
          } catch (err) {
            assert.ok(err instanceof Error)
          } finally {
            os.tmpdir = origfn
          }
        })
      })
      describe('on issue #268', () => {
        const origfn = os.tmpdir
        it(`should not alter ${isWindows ? 'invalid' : 'valid'} path on os.tmpdir() returning path that includes double quotes`, () => {
          const tmpdir = isWindows ? '"C:\\Temp With Spaces"' : '"/tmp with spaces"'
          os.tmpdir = () => tmpdir
          const name = tmp.tmpNameSync()
          const index = name.indexOf(path.sep + tmpdir + path.sep)
          try {
            assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`)
          } finally {
            os.tmpdir = origfn
          }
        })
        it('should not alter valid path on os.tmpdir() returning path that includes single quotes', () => {
          const tmpdir = isWindows ? '\'C:\\Temp With Spaces\'' : '\'/tmp with spaces\''
          os.tmpdir = () => tmpdir
          const name = tmp.tmpNameSync()
          const index = name.indexOf(path.sep + tmpdir + path.sep)
          try {
            assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`)
          } finally {
            os.tmpdir = origfn
          }
        })
      })
    })

    describe('when running standard outband tests', () => {
    })

    describe('when running issue specific outband tests', () => {
    })
  })
})
