const tmp = require('../../lib/tmp')

process.on('SIGINT', () => {
  process.exit(0)
})

process.on('SIGTERM', () => {
  process.exit(0)
})

// https://github.com/raszi/node-tmp/issues/121
module.exports = function () {
  tmp.setGracefulCleanup()

  const result = tmp.dirSync({ unsafeCleanup: true })

  this.out(result.name, () => { })

  setTimeout(() => {
    throw new Error('ran into timeout')
  }, 10000)
}
