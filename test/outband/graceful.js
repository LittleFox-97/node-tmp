module.exports = function (result) {
  this.out(result.name, () => {
    throw new Error('(non-)graceful cleanup testing')
  })
}
