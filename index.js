const ArgumentsLengthError = require('./errors/ArgumentsLength')
const DescriptionsTypeError = require('./errors/DescriptionsType')
const ArgsTypeError = require('./errors/ArgsType')
const ArgsLengthError = require('./errors/ArgsLength')
const ArgTypeError = require('./errors/ArgType')
const ArgInstanceError = require('./errors/ArgInstance')
const DescriptionTypeError = require('./errors/DescriptionType')

module.exports = function arguguard(descriptions, args) {
  if (arguments.length !== 2) {
    throw new ArgumentsLengthError(`Expected 2 arguments, received ${arguments.length}`)
  }
  if (!(descriptions instanceof Array)) {
    throw new DescriptionsTypeError(`Expected descriptions("${descriptions.constructor.name}") to be instance of "Array"`)
  }
  if (!(args instanceof Object)) {
    throw new ArgsTypeError('Expected args to be instance of object')
  }
  if (args.length !== descriptions.length) {
    throw new ArgsLengthError(`Expected args(${args.length}) to have same length as descriptions(${descriptions.length})`)
  }
  descriptions.forEach((description, index) => {
    const arg = args[index]
    if (typeof description === 'string') {
      const argType = typeof arg
      // eslint-disable-next-line valid-typeof
      if (argType !== description) {
        throw new ArgTypeError(`Expected arguments[${index}]("${argType}") to have type of "${description}"`)
      }
      return
    }

    if (typeof description === 'function') {
      if (!(arg instanceof description)) {
        throw new ArgInstanceError(`Expected args[${index}]("${description.name}") to be instance of "${arg.constructor.name}"`)
      }
      return
    }

    throw new DescriptionTypeError(`Expected descriptions[${index}] to to have type string or function but received ${typeof description}`)
  })
}
