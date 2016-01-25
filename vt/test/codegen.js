var Parser = require('../src/parser')
var util = require('util')
var fs = require('fs')
var codegen = require('../src/codegen')

var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')
var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')
var str3 = fs.readFileSync('./fixtures/test3.html', 'utf-8')


describe('Test for walk through the AST', function () {
  it('walk walk walk', function () {
    var root = (new Parser(str)).parse()
    codegen(root)
    var root = (new Parser(str2)).parse()
    codegen(root)
    var root = (new Parser(str3)).parse()
    codegen(root)
  })
})