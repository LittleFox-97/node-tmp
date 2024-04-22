function _writeSync(stream, str, cb) {
  const flushed = stream.write(str)
  if (flushed) {
    return cb(null)
  }

  stream.once('drain', () => {
    cb(null)
  })
}

module.exports = {
  graceful: false,
  out(str, cb = this.exit) {
    _writeSync(process.stdout, str, cb)
  },
  err(errOrStr, cb = this.exit) {
    if (this.graceful) {
      cb()
    } else {
      _writeSync(process.stderr, (errOrStr instanceof Error) ? errOrStr.toString() : errOrStr, cb)
    }
  },
  fail(errOrStr, cb = this.exit) {
    _writeSync(process.stderr, (errOrStr instanceof Error) ? errOrStr.toString() : errOrStr, cb)
  },
  exit(code) {
    process.exit(code || 0)
  }
}
