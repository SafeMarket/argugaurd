const ApiArgumentsLengthError = require('../errors/api/ArgumentsLength')
const ApiDescriptionError = require('../errors/api/Description')
const ApiTestError = require('../errors/api/Test')
const getMessage = require('./getMessage')
const createTestableErrorClass = require('testable-error')

function Validator(name, test) {
  if (arguments.length !== 2) {
    throw new ApiArgumentsLengthError(getMessage('Validator() arguments.length', '2', arguments.length))
  }
  if (typeof name !== 'string') {
    throw new ApiDescriptionError(getMessage('Validator() arguments[0] (name)', 'string', typeof name))
  }
  if (typeof test !== 'function') {
    throw new ApiTestError(getMessage('Validator() arguments[1] (test)', 'function', typeof test))
  }
  this.name = name
  this.Error = createTestableErrorClass(`Arguguard:User:ValidationError:${name}`)
  this.test = test
}

module.exports = Validator
