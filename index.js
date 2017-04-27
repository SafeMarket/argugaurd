const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiDescriptionError = require('./errors/api/Description')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

const Validator = require('./lib/Validator')
const getMessage = require('./lib/getMessage')

function getConstructorName(argument) {
  if (argument === undefined) {
    return 'undefined'
  }
  if (!argument.constructor) {
    return argument
  }
  return argument.constructor.name
}

function argumentValidate(label, description, argument) {
  if (description instanceof Validator) {
    try {
      description.test(argument)
      return
    } catch (err) {
      throw new description.Error(`${label} ${err.message}`)
    }
  }

  const isArray = description.indexOf('[]') === 0
  if (isArray) {
    if (!(argument instanceof Array)) {
      throw new UserArgumentInstanceError(
        getMessage(`${label} constructor`, 'Array', getConstructorName(argument))
      )
    }
    argument.forEach((_argument, _index) => {
      argumentValidate(`${label}[${_index}]`, description.substr(2), _argument)
    })
    return
  }

  // eslint-disable-next-line valid-typeof
  const firstLetter = description.charAt(0)
  const isLowerCase = firstLetter === firstLetter.toLowerCase()

  if (isLowerCase) {
    if (typeof argument !== description) {
      throw new UserArgumentTypeError(getMessage(`${label} type`, description, typeof argument))
    }
    return
  }

  if (argument === undefined || description !== getConstructorName(argument)) {
    throw new UserArgumentInstanceError(getMessage(`${label} constructor`, description, getConstructorName(argument)))
  }
}

const arguguard = function arguguard(label, descriptions, args) {
  if (arguguard.options.disabled === true) {
    return
  }
  apiValidate(...arguments)
  if (args.length > descriptions.length) {
    throw new UserArgumentsLengthError(getMessage(`${label} arguments.length`, `no more than ${descriptions.length}`, args.length))
  }
  descriptions.forEach((description, index) => {
    argumentValidate(`${label} arguments[${index}]`, description, args[index])
  })
}

arguguard.options = {
  disabled: false,
  allowSynonymousConstructors: true
}

module.exports = arguguard

function apiValidate(label, descriptions, args) {
  if (arguments.length !== 3) {
    throw new ApiArgumentsLengthError(getMessage('arguguard() arguments.length', 3, arguments.length))
  }
  if (typeof label !== 'string') {
    throw new ApiLabelTypeError(getMessage('arguguard() arguments[0] (label)', 'string', typeof label))
  }
  if (!(descriptions instanceof Array)) {
    throw new ApiDescriptionsInstanceError(getMessage('arguguard() arguments[1] (description)', 'Array', descriptions.constructor.name))
  }
  descriptions.forEach((description, index) => {
    apiDescriptionValidate(`arguguard() descriptions[${index}]`, description)
  })
  if (!(args instanceof Object)) {
    throw new ApiArgsInstanceError(getMessage('arguguard() arguments[2] (args)', 'Object', args.constructor.name))
  }
}

function apiDescriptionValidate(label, description) {
  if (description instanceof Validator) {
    return
  }
  if (typeof description === 'string') {
    return
  }
  throw new ApiDescriptionError(getMessage(label, 'string/Validator', typeof description))

}
