/* globals describe it */

const arguguard = require('./')

const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionError = require('./errors/api/Description')
const ApiTestError = require('./errors/api/Test')
const ApiArrayDescriptionLengthError = require('./errors/api/ArrayDescriptionLength')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

const Validator = require('./lib/Validator')

const chai = require('chai')

const A = function A() {}
const a = new A()


const aboveThreeValidator = new Validator('AboveThree', (arg) => {
  if (typeof arg !== 'number') {
    throw new Error(`should be a number, received "${typeof arg}"`)
  }
  if (arg <= 3) {
    throw new Error(`should be greater than 3, received ${arg}`)
  }
})

chai.should()

const MyClass = function MyClass() {}
const myClass = new MyClass()

const FakeMyClass = function MyClass() {}
const fakeMyClass = new FakeMyClass()

function myFunction() {
  arguguard('myFunction()', ['number', MyClass, [MyClass], aboveThreeValidator], arguments)
}

function callback() {}

describe('arguguard', () => {
  describe('errors', () => {
    describe('api', () => {
      describeError(ApiArgumentsLengthError, 'Arguguard:Api:ArgumentsLengthError: arguguard() arguments.length should be "3", received "2"', () => {
        arguguard([], arguments)
      })
      describeError(ApiArgumentsLengthError, 'Arguguard:Api:ArgumentsLengthError: Validator() arguments.length should be "2", received "1"', () => {
        new Validator(() => {})
      })
      describeError(ApiLabelTypeError, 'Arguguard:Api:LabelTypeError: arguguard() arguments[0] (label) should be "string", received "object"', () => {
        arguguard({}, [], arguments)
      })
      describeError(ApiDescriptionsInstanceError, 'Arguguard:Api:DescriptionsInstanceError: arguguard() arguments[1] (description) should be "Array", received "Object"', () => {
        arguguard('myFunction', {}, arguments)
      })
      describeError(ApiDescriptionError, 'Arguguard:Api:DescriptionError: arguguard() descriptions[0] should be "string/function/Array/Validator", received "boolean"', () => {
        arguguard('myFunction', [true], true)
      })
      describeError(ApiDescriptionError, 'Arguguard:Api:DescriptionError: arguguard() descriptions[1] should be "string/function/Array/Validator", received "boolean"', () => {
        arguguard('myFunction', ['number', true], true)
      })
      describeError(ApiDescriptionError, 'Arguguard:Api:DescriptionError: Validator() arguments[0] (name) should be "string", received "boolean"', () => {
        new Validator(true, true)
      })
      describeError(ApiTestError, 'Arguguard:Api:TestError: Validator() arguments[1] (test) should be "function", received "boolean"', () => {
        new Validator('above 3', true)
      })
      describeError(ApiArrayDescriptionLengthError, 'Arguguard:Api:ArrayDescriptionLength: arguguard() descriptions[2] length should be "1", received "0"', () => {
        arguguard('myFunction', ['number', MyClass, []], true)
      })
      describeError(ApiArgsInstanceError, 'Arguguard:Api:ArgsInstanceError: arguguard() arguments[2] (args) should be "Object", received "Boolean"', () => {
        arguguard('myFunction', ['number', MyClass, [MyClass]], true)
      })
    })
    describe('user', () => {
      describeError(UserArgumentsLengthError, 'Arguguard:User:ArgumentsLengthError: myFunction() arguments.length should be "4", received "0"', () => {
        myFunction()
      })
      describeError(UserArgumentsLengthError, 'Arguguard:User:ArgumentsLengthError: myFunction() arguments.length should be "4", received "5"', () => {
        myFunction(1, myClass, [myClass, myClass], 4, callback)
      })
      describeError(UserArgumentTypeError, 'Arguguard:User:ArgumentTypeError: myFunction() arguments[0] type should be "number", received "string"', () => {
        myFunction('1', myClass, [myClass, myClass], 4)
      })

      describeError(UserArgumentTypeError, 'Arguguard:User:ArgumentTypeError: myFunction() arguments[0] type should be "number", received "boolean"', () => {
        myFunction(true, myClass, [myClass, myClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[1] constructor should be "MyClass", received "Object"', () => {
        myFunction(1, {}, [myClass, myClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[1] constructor should be "MyClass", received "Function"', () => {
        myFunction(1, MyClass, [myClass, myClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2] constructor should be "Array", received "MyClass"', () => {
        myFunction(1, myClass, myClass, 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2] constructor should be "Array", received "undefined"', () => {
        myFunction(1, myClass, undefined, 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2][1] constructor should be "MyClass", received "Function"', () => {
        myFunction(1, myClass, [myClass, MyClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2][1] constructor should be "MyClass", received "Function"', () => {
        myFunction(1, myClass, [myClass, MyClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2][1] constructor should be "MyClass", received "Function"', () => {
        myFunction(1, myClass, [myClass, MyClass], 4)
      })
      describeError(UserArgumentInstanceError, 'Arguguard:User:ArgumentInstanceError: myFunction() arguments[2][1] constructor should be "MyClass", received "MyClass"', () => {
        myFunction(1, myClass, [myClass, fakeMyClass], 4)
      })
      describeError(aboveThreeValidator.Error, 'Arguguard:User:ValidationError:AboveThree: myFunction() arguments[3] should be a number, received "string"', () => {
        myFunction(1, myClass, [myClass, myClass], '4')
      })
      describeError(aboveThreeValidator.Error, 'Arguguard:User:ValidationError:AboveThree: myFunction() arguments[3] should be greater than 3, received 3', () => {
        myFunction(1, myClass, [myClass, myClass], 3)
      })
    })
  })
  describe('success', () => {
    it('should pass with myFunction(1, myClass, [myClass, myClass], 4)', () => {
      myFunction(1, myClass, [myClass, myClass], 4)
    })
    it('should pass with myFunction(1, fakeMyClass, [fakeMyClass, fakeMyClass], 4)', () => {
      arguguard.allowSynonymousConstructors = true
      myFunction(1, fakeMyClass, [fakeMyClass, fakeMyClass], 4)
    })
    it('should pass with A:a, number:1, Array:[], object:[], Object:{}, object:{}, Error:error', () => {
      arguguard(
        'success',
        [A, 'number', Array, 'object', Object, 'object', Error],
        [a, 1, [], [], {}, {}, new Error()]
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
