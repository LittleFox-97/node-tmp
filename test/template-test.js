const assert = require('node:assert')
const tmp = require('../lib/tmp')

describe('tmp', () => {
  describe('dir()', () => {
    it('with invalid template', (done) => {
      tmp.dir({ template: 'invalid' }, (err) => {
        if (!err) {
          return done(new Error('err expected'))
        }
        try {
          assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error')
        } catch (err2) {
          return done(err2)
        }
        done()
      })
    })
  })

  describe('file()', () => {
    it('with invalid template', (done) => {
      tmp.file({ template: 'invalid' }, (err) => {
        if (!err) {
          return done(new Error('err expected'))
        }
        try {
          assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error')
        } catch (err2) {
          return done(err2)
        }
        done()
      })
    })
  })
})
