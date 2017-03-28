const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiDescriptionError = require('./errors/api/Description')
const ApiArrayDescriptionLengthError = require('./errors/api/ArrayDescriptionLength')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

const Validator = require('./lib/Validator')
const getMessage = require('./lib/getMessage')

function hasConstructor(thing) {
  try {
    if (thing.constructor) {
      return true
    }
  } catch (err) {
    return false
  }
}

function argumentValidate(label, description, argument) {

  if (description instanceof Validator) {
    try {
      description.test(argument)
    } catch (err) {
      throw new description.Error(`${label} ${err.message}`)
    }
  } else if (typeof description === 'string') {
    // eslint-disable-next-line valid-typeof
    if (typeof argument !== description) {
      throw new UserArgumentTypeError(getMessage(`${label} type`, description, typeof argument))
    }
  } else if (typeof description === 'function') {
    if (!hasConstructor(argument)) {
      throw new UserArgumentInstanceError(getMessage(`${label} constructor`, description.name, argument))
    } else if (arguguard.options.allowSynonymousConstructors) {
      if (description.name !== argument.constructor.name) {
        throw new UserArgumentInstanceError(getMessage(`${label} constructor`, description.name, argument.constructor.name))
      }
    } else {
      if (!(argument instanceof description)) {
        throw new UserArgumentInstanceError(getMessage(`${label} constructor`, description.name, argument.constructor.name))
      }
    }
  } else if (description instanceof Array) {
    if (!(argument instanceof Array)) {
      throw new UserArgumentInstanceError(
        getMessage(`${label} constructor`, 'Array', hasConstructor(argument) ? argument.constructor.name : argument)
      )
    }
    argument.forEach((_argument, _index) => {
      argumentValidate(`${label}[${_index}]`, description[0], _argument)
    })
  }
}


const arguguard = function arguguard(label, descriptions, args) {
  if (arguguard.options.disabled === true) {
    return
  }
  apiValidate(...arguments)
  if (args.length !== descriptions.length) {
    throw new UserArgumentsLengthError(getMessage(`${label} arguments.length`, descriptions.length, args.length))
  }
  descriptions.forEach((description, index) => {
    argumentValidate(`${label} arguments[${index}]`, description, args[index])
  })
}

arguguard.options = {
  disabled: false,
  allowSynonymousConstructors: false
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
  if (typeof description === 'function') {
    return
  }
  if (description instanceof Array) {
    if (description.length !== 1) {
      throw new ApiArrayDescriptionLengthError(getMessage(`${label} length`, 1, description.length))
    }
    apiDescriptionValidate(`${label}[0]`, description[0])
    return
  }
  throw new ApiDescriptionError(getMessage(label, 'string/function/Array/Validator', typeof description))

}
