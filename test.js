/* globals describe it */

const arguguard = require('./')

const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionError = require('./errors/api/Description')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

const chai = require('chai')

const A = function A() {}
const a = new A()

const B = function B() {}
const b = new B()

chai.should()

function MyClass(){ }

function myFunction(myNumber, myClass) {
  arguguard('myFunction()', ['number', MyClass], arguments)
}

function callback() {}

describe('arguguard', () => {
  describe('errors', () => {
    describe('api', () => {
      describeError(ApiArgumentsLengthError, 'Arguguard:Api:ArgumentsLengthError: arguguard() arguments.length should be "3", received "2"', () => {
        arguguard(['number', MyClass], arguments)
      })
      describeError(ApiLabelTypeError, 'Arguguard:Api:LabelTypeError: arguguard() arguments[0] (label) should be "string", received "object"', () => {
        arguguard({}, ['number', MyClass], arguments)
      })
      describeError(ApiDescriptionsInstanceError, 'Arguguard:Api:DescriptionsInstanceError: arguguard() arguments[1] (description) should be "Array", received "Object"', () => {
        arguguard('myFunction', {}, true)
      })
      describeError(ApiDescriptionError, 'Arguguard:Api:DescriptionError: arguguard() descriptions[0] should be "string/function", received "boolean"', () => {
        arguguard('myFunction', [true], true)
      })
      describeError(ApiDescriptionError, 'Arguguard:Api:DescriptionError: arguguard() descriptions[1] should be "string/function", received "boolean"', () => {
        arguguard('myFunction', ['number', true], true)
      })
      describeError(ApiArgsInstanceError, 'Arguguard:Api:ArgsInstanceError: arguguard() arguments[2] (args) should be "Object", received "Boolean"', () => {
        arguguard('myFunction', ['number', MyClass], true)
      })
    })
    describe('user', () => {
      describeError(UserArgumentsLengthError, 'Arguguard:User:ArgumentsLengthError: myFunction() arguments.length should be "2", received "0"', () => {
        myFunction()
      })
      describeError(UserArgumentsLengthError, 'Arguguard:User:ArgumentsLengthError: myFunction() arguments.length should be "2", received "3"', () => {
        myFunction(1, [true], callback)
      })
      describeError(UserArgumentTypeError, 'Arguguard:User:ArgumentTypeError: myFunction() arguments[0] type should be "number", received "string"', () => {
        myFunction('1', [])
      })
      describeError(UserArgumentTypeError, 'Arguguard:User:ArgumentTypeError: myFunction() arguments[0] type should be "number", received "boolean"', () => {
        myFunction(true, [])
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[1] constructor should be "MyClass", received "Object"', () => {
        myFunction(1, {})
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[1] constructor should be "MyClass", received "Function"', () => {
        myFunction(1, MyClass)
      })
    })
  })
  describe('success', () => {
    it('should pass with myFunction(1, new MyClass)', () => {
      myFunction(1, new MyClass())
    })
    it('should pass with A:a, number:1, Array:[], object:[], Object:{}, object:{}, Error:error', () => {
      arguguard(
        'success',
        [A, 'number', Array, 'object', Object, 'object', Error],
        [a, 1, [], [], {}, {}, new Error]
      )
    })
  })
})

function describeError(ErrorClass, message, func) {
  describe(ErrorClass.name, () => {
    let err
    it('should throw', () => {
      try { func() } catch (_err) { err = _err }
      err.should.be.instanceOf(ErrorClass)
    })
    it(`should have message "${message}"`, () => {
      err.message.should.equal(message)
    })
  })
}
