var Parser = require('./parser')
var fs = require('fs')
var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')
var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')

new Parser(str)
new Parser(str2)
