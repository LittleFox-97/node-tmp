const assert = require('node:assert')
const tmp = require('../lib/tmp')

describe('tmp', () => {
  describe('dirSync()', () => {
    it('with invalid template', () => {
      try {
        tmp.dirSync({ template: 'invalid' })
      } catch (err) {
        assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error')
      }
    })
  })

  describe('fileSync()', () => {
    it('with invalid template', () => {
      try {
        tmp.fileSync({ template: 'invalid' })
      } catch (err) {
        assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error')
      }
    })
  })
})
