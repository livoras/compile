var Tokenizer = require('./tokenizer')
var fs = require('fs')
var parser = require('./parser')

var str = fs.readFileSync(__dirname + '/fixture.json', 'utf-8')
var str2 = fs.readFileSync(__dirname + '/fixture2.json', 'utf-8')
var _1 = 'sio'

var obj = {
  name: "jerry",
  age: ['12', {}, {name: 'shit', shi: []}],
  girls: [{name: 'lily'}, {}, {}],
  shit: '33',
  kk: _1
}

var objStr = JSON.stringify(obj)

var o = parser.parse(new Tokenizer(objStr))
console.log(o)
console.log(obj)
// parser.parse(new Tokenizer(str2))
