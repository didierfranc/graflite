/* eslint-disable no-restricted-syntax, no-prototype-builtins, max-len */
module.exports = (propTypes, object, type) => {
  const errors = []

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const typed = propTypes.hasOwnProperty(key)
      if (!typed) {
        errors.push(
          `the property '${key}' is missing in the '${type}' type definition`,
        )
      }
    }
  }

  for (const key in propTypes) {
    if (propTypes.hasOwnProperty(key)) {
      const element = propTypes[key]

      const supplied = typeof object[key]
      const expected = element.type

      if (element.type.required && !object.hasOwnProperty(key)) {
        errors.push(
          `the property '${key}' is required in the '${type}' type definition`,
        )
      } else if (supplied !== expected) {
        errors.push(
          `invalid property '${key}' of type '${supplied}' supplied to '${type}' expected '${expected}'`,
        )
      }
    }
  }

  return errors
}
