const get = (obj, prop) =>
  (prop === 'isRequired' ? { ...obj, required: true } : obj[prop])

const p = type => new Proxy({ type }, { get })

module.exports = {
  number: p('number'),
  string: p('string'),
  bool: p('boolean'),
}
