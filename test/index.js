var fs = require('fs')
var test = require('tape')
var pieces = require('pieces')
var verify = require('../')

// 645b
var lorem = './test/fixtures/lorem.txt'

// 64b
var piece_length = Math.pow(2, 6)

var pass = function(t, result, encoding) {
  t.plan(1)
  fs.createReadStream(lorem)
    .pipe(verify(result, piece_length, encoding))
    .on('error', function(error) {
      t.fail(error.message)
    })
    .on('finish', function() {
      t.pass('ok')
    })
}

var passWithEncoding = function(encoding) {
  return function(t) {
    var result = []
    pieces(lorem, piece_length)
      .on('data', function(piece) {
        result.push(piece.toString(encoding))
      })
      .on('end', function() {
        pass(t, result, encoding)
      })
  }
}

var fail = function(t, result, encoding) {
  t.plan(1)
  fs.createReadStream(lorem)
    .pipe(verify(result, piece_length, encoding))
    .on('error', function(error) {
      t.pass(error.message)
    })
    .on('finish', function() {
      t.fail('ok')
    })
}

var failWithEncoding = function(encoding, against) {
  return function(t) {
    var result = []
    pieces(lorem, piece_length)
      .on('data', function(piece) {
        result.push(piece.toString(encoding))
      })
      .on('end', function() {
        fail(t, result, against)
      })
  }
}

test('with raw pieces', function(t) {
  pieces(lorem, piece_length,
    function(error, result) {
      pass(t, result)
    })
})

test('with hex string pieces', passWithEncoding('hex'))
test('with binary string pieces', passWithEncoding('binary'))
test('with base64 string pieces', passWithEncoding('base64'))

test('hex string pieces against raw', failWithEncoding('hex'))
test('binary string pieces against hex', failWithEncoding('binary', 'hex'))
test('base64 string pieces against binary', failWithEncoding('base64', 'binary'))
test('hex string pieces against base64', failWithEncoding('hex', 'base64'))
