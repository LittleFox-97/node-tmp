const path = require('node:path')
const tmp = require('../lib/tmp')
const assertions = require('./assertions')

module.exports = function inbandStandard(beforeHook) {
  describe('without any parameters', inbandStandardTests({ prefix: 'tmp-' }, null, beforeHook))
  describe('with prefix', inbandStandardTests(null, { prefix: 'something' }, beforeHook))
  describe('with postfix', inbandStandardTests(null, { postfix: '.txt' }, beforeHook))
  describe('with template and no leading path', inbandStandardTests({ prefix: 'clike-', postfix: '-postfix' }, { template: 'clike-XXXXXX-postfix' }, beforeHook))
  describe('with template and leading path', inbandStandardTests({ prefix: 'clike-', postfix: '-postfix' }, { template: path.join(tmp.tmpdir, 'clike-XXXXXX-postfix') }, beforeHook))
  describe('with multiple options', inbandStandardTests(null, { prefix: 'foo', postfix: 'bar', tries: 5 }, beforeHook))
  describe('with name', inbandStandardTests(null, { name: 'using-name' }, beforeHook))
}

function inbandStandardTests(testOpts = {}, opts = {}, beforeHook) {
  return () => {
    const topic = { topic: null, opts }

    // bind everything to topic so we avoid global
    before(beforeHook.bind(topic))

    it('should return a proper result', function () {
      assertions.assertName(this.topic)
    }.bind(topic))

    if (opts.prefix || testOpts.prefix) {
      it('should have the expected prefix', function () {
        assertions.assertPrefix(this.topic, testOpts.prefix || opts.prefix)
      }.bind(topic))
    }

    if (opts.postfix || testOpts.postfix) {
      it('should have the expected postfix', function () {
        assertions.assertPostfix(this.topic, testOpts.postfix || opts.postfix)
      }.bind(topic))
    }

    if (opts.name) {
      it('should have the expected name', function () {
        assertions.assertName(this.topic, opts.name)
      }.bind(topic))
    }
  }
}
