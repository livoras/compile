var Parser = require('./parser')
var fs = require('fs')
var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')

new Parser(str)
