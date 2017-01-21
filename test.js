/* globals describe it */

const argugaurd = require('./')
const ArgumentsLengthError = require('./errors/ArgumentsLength')
const DescriptionsTypeError = require('./errors/DescriptionsType')
const ArgsTypeError = require('./errors/ArgsType')
const ArgsLengthError = require('./errors/ArgsLength')
const ArgTypeError = require('./errors/ArgType')
const ArgInstanceError = require('./errors/ArgInstance')
const DescriptionTypeError = require('./errors/DescriptionType')
const chai = require('chai')

const A = function A() {}
const a = new A()

const B = function B() {}
const b = new B()

chai.should()

describe('argugaurd', () => {
  describe('ArgumentsLengthError', () => {
    it('should throw with 0 arguments', () => {
      (() => {
        argugaurd()
      }).should.throw(ArgumentsLengthError)
    })
    it('should throw with 3 arguments', () => {
      (() => {
        argugaurd(1, 2, 3)
      }).should.throw(ArgumentsLengthError)
    })
    it('should NOT throw  with 2 arguments', () => {
      (() => {
        argugaurd(1, 2)
      }).should.not.throw(ArgumentsLengthError)
    })
  })
  describe('DescriptionsTypeError', () => {
    it('should throw with descriptions as object', () => {
      (() => {
        argugaurd({}, true)
      }).should.throw(DescriptionsTypeError)
    })
    it('should NOT throw with descriptions as array', () => {
      (() => {
        argugaurd([], true)
      }).should.not.throw(DescriptionsTypeError)
    })
  })
  describe('ArgsTypeError', () => {
    it('should throw with args as boolean', () => {
      (() => {
        argugaurd([], true)
      }).should.throw(ArgsTypeError)
    })
    it('should NOT throw with args as array', () => {
      (() => {
        argugaurd([], [])
      }).should.not.throw(ArgsTypeError)
    })
  })
  describe('ArgsLengthError', () => {
    it('should throw with args too small', () => {
      (() => {
        argugaurd(['string'], [])
      }).should.throw(ArgsLengthError)
    })
    it('should throw with args too large', () => {
      (() => {
        argugaurd(['string'], ['hello', 'world'])
      }).should.throw(ArgsLengthError)
    })
    it('should NOT throw with args just right', () => {
      (() => {
        argugaurd(['string'], ['hello world'])
      }).should.not.throw(ArgsLengthError)
    })
  })
  describe('ArgTypeError', () => {
    it('should throw with number:{}', () => {
      (() => {
        argugaurd(['number'], [{}])
      }).should.throw(ArgTypeError)
    })
    it('should throw with number:3, array:{}', () => {
      (() => {
        argugaurd(['number', 'array'], [3, {}])
      }).should.throw(ArgTypeError)
    })
    it('should NOT throw with number:3, array:[]', () => {
      (() => {
        argugaurd(['number', 'array'], [3, []])
      }).should.throw(ArgTypeError)
    })
  })
  describe('ArgInstanceError', () => {
    it('should throw with A:{}', () => {
      (() => {
        argugaurd([A], [{}])
      }).should.throw(ArgInstanceError)
    })
    it('should throw with A:3, Array:{}', () => {
      (() => {
        argugaurd([A, B], [a, {}])
      }).should.throw(ArgInstanceError)
    })
    it('should NOT throw with A:3, Array:[]', () => {
      (() => {
        argugaurd([A, B], [a, b])
      }).should.not.throw(ArgInstanceError)
    })
  })
  describe('DescriptionTypeError', () => {
    it('should throw with {}:{}', () => {
      (() => {
        argugaurd([{}], [{}])
      }).should.throw(DescriptionTypeError)
    })
  })
  describe('success', () => {
    it('should pass with A:a, number:1, Array:[], object:[], Object:{}, object:{}', () => {
      argugaurd(
        [A, 'number', Array, 'object', Object, 'object'],
        [a, 1, [], [], {}, {}]
      )
    })
  })
})

describe('readme', () => {

  function myFunction(myNumber, myArray){
    argugaurd(['number', Array], arguments)
    return true
  }

  it('myFunction errors should match', () => {
    try { myFunction(3) } catch (err) {
      err.message.should.equal('Argugaurd:ArgsLengthError: Expected args(1) to have same length as descriptions(2)')
    }
    try { myFunction('3', []) } catch (err) {
      err.message.should.equal('Argugaurd:ArgTypeError: Expected arguments[0]("string") to have type of "number"')
    }
    try { myFunction(3, {}) } catch (err) {
      err.message.should.equal('Argugaurd:ArgInstanceError: Expected args[1]("Array") to be instance of "Object"')
    }
    myFunction(3, [])
  })

  it('argugaurd errors should match', () => {
    try { argugaurd('number', arguments) } catch (err) {
      err.message.should.equal('Argugaurd:DescriptionsTypeError: Expected descriptions("String") to be instance of "Array"')
    }
  })
})
