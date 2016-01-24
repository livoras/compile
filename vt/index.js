var Parser = require('./parser')
var fs = require('fs')
var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')
var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')

var root = (new Parser(str)).parse()
console.log(util.inspect(root, false, null))

var root = new Parser(str2).parse()
console.log(util.inspect(root, false, null))
