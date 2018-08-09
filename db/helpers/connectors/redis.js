const Redis = require('ioredis')
const { v4 } = require('uuid')

const checkPropTypes = require('../types/checkPropTypes')

class RedisEngine {
  constructor(uri) {
    this.redis = new Redis(uri)
  }

  set(propTypes, type, values) {
    return Promise.all(
      values.map(async (value) => {
        const id = `${type}:${v4()}`

        const errors = checkPropTypes(propTypes, value, type)
        if (errors.length > 0) {
          console.error(errors)
          return []
        }

        const p = this.redis
          .pipeline()
          .hmset(id, value)
          .sadd(type, id)

        Object.keys(value).forEach((key) => {
          const v = value[key]
          const t = typeof value[key]

          if (t === 'number') {
            p.zadd(key, v, id)
          } else {
            p.sadd(`${key}:${v}`, id)
          }
        })

        await p.exec()

        return id
      }),
    )
  }

  link(a, link, b) {
    if (a && link && b) {
      return this.redis.lpush(`${link}:${b}`, a)
    }
    return null
  }

  async get(typeOrLink, id) {
    const key = `${typeOrLink}:${id}`
    const t = await this.redis.type(key)

    if (t === 'string') {
      return this.redis.hgetall(key)
    }

    if (t === 'list') {
      const list = await this.redis.lrange(key, 0, 10)
      if (list.length === 1) {
        return this.redis.hgetall(list[0])
      }
      return list
    }

    return null
  }

  async greaterThan(a, b, type) {
    let range = await this.redis.zrangebyscore(a, b, '+inf')

    const p = this.redis.pipeline()
    range = range.filter(k => k.startsWith(type))
    range.forEach(k => p.hgetall(k))

    const results = await p.exec()
    return results.map((r, i) => ({ __key: range[i], ...r[1] }))
  }

  async equalTo(a, b, type) {
    const k = `${a}:${b}`

    const keys = await this.redis.sinter(k, type)
    const p = this.redis.pipeline()

    keys.forEach(key => p.hgetall(key))
    const results = await p.exec()
    return results.map((r, i) => ({ __key: keys[i], ...r[1] }))
  }
}

module.exports = RedisEngine
