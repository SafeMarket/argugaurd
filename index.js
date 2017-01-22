const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiDescriptionError = require('./errors/api/Description')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

function getMessage(label, expects, actual) {
  return `${label} should be "${expects}", received "${actual}"`
}

function argumentValidate(label, description, argument) {
  if (typeof description === 'string') {
    // eslint-disable-next-line valid-typeof
    if (typeof argument !== description) {
      throw new UserArgumentTypeError(getMessage(`${label} type`, description, typeof argument))
    }
  }

  if (typeof description === 'function') {
    if (!(argument instanceof description)) {
      throw new UserArgumentInstanceError(
        getMessage(`${label} constructor`, description.name, argument.constructor.name)
      )
    }
  }
}


module.exports = function arguguard(label, descriptions, args) {
  apiValidate(...arguments)
  if (args.length !== descriptions.length) {
    throw new UserArgumentsLengthError(getMessage(`${label} arguments.length`, descriptions.length, args.length))
  }
  descriptions.forEach((description, index) => {
    argumentValidate(`${label} arguments[${index}]`, description, args[index])
  })
}

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
    if (typeof description === 'string') {
      return
    }
    if (typeof description === 'function') {
      return
    }
    throw new ApiDescriptionError(getMessage(`arguguard() descriptions[${index}]`, 'string/function', typeof description))
  })
  if (!(args instanceof Object)) {
    throw new ApiArgsInstanceError(getMessage('arguguard() arguments[2] (args)', 'Object', args.constructor.name))
  }
}
