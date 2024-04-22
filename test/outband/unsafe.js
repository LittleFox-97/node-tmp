const fs = require('node:fs')
const { join } = require('node:path')

module.exports = function (result) {
  // file that should be removed
  const fd = fs.openSync(join(result.name, 'should-be-removed.file'), 'w')
  fs.closeSync(fd)

  // in tree source
  const symlinkSource = join(__dirname, 'fixtures', 'symlinkme')
  // testing target
  const symlinkTarget = join(result.name, 'symlinkme-target')

  // symlink that should be removed but the contents should be preserved.
  // Skip on Windows because symlinks require elevated privileges (instead just
  // create the file)
  if (process.platform === 'win32') {
    fs.writeFileSync(symlinkTarget, '')
  } else {
    fs.symlinkSync(symlinkSource, symlinkTarget, 'dir')
  }

  this.out(result.name)
}
