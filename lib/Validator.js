const ApiArgumentsLengthError = require('../errors/api/ArgumentsLength')
const ApiDescriptionError = require('../errors/api/Description')
const ApiTestError = require('../errors/api/Test')
const getMessage = require('./getMessage')

function Validator(description, test) {
  if (arguments.length !== 2) {
    throw new ApiArgumentsLengthError(getMessage('Validator() arguments.length', '2', arguments.length))
  }
  if (typeof description !== 'string') {
    throw new ApiDescriptionError(getMessage('Validator() arguments[0] (description)', 'string', typeof description))
  }
  if (typeof test !== 'function') {
    throw new ApiTestError(getMessage('Validator() arguments[1] (test)', 'function', typeof test))
  }
  this.description = description
  this.test = test
}

// eslint-disable-next-line max-len
Validator.prototype.validate = function validate(value) {
  return this.test(value)
}

module.exports = Validator
