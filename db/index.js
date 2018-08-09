const getEngine = require('./helpers/connectors')

class Graflite {
  constructor(uri) {
    this.db = getEngine(uri)
  }

  type(name, value) {
    this.type[name] = value
  }

  async find(type, filter) {
    const compare = filter.match(/(\w+)(=|<=|>=|<|>)(\w+)/)

    if (compare) {
      const [, a, comparator, b] = compare

      const isNumber = !!parseFloat(b)

      if (isNumber) {
        if (comparator === '>') {
          return this.db.greaterThan(a, b, type)
        }
      } else if (comparator === '=') {
        return this.db.equalTo(a, b, type)
      }
    }
    return null
  }

  get(typeOrLink, id) {
    return this.db.get(typeOrLink, id)
  }

  async set(type, values) {
    if (!Array.isArray(values)) {
      throw new Error('values provided to `db.set()` must be an array')
    }

    const propTypes = this.type[type]
    if (!propTypes) {
      console.error(`'${type}' type is not defined`)
      return []
    }

    return this.db.set(propTypes, type, values)
  }

  async link(a, link, b) {
    this.db.link(a, link, b)
  }
}

module.exports = Graflite
