const Redis = require('./redis')

module.exports = (uri) => {
  if (/redis/.test(uri)) {
    return new Redis(uri)
  }
  console.error('missing or incompatible database uri')
  return null
}
