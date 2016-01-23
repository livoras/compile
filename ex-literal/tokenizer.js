var types = require('./types')
var fs = require('fs')
var str = fs.readFileSync(__dirname + '/fixture.json', 'utf-8')

function Tokenizer (str) {
  this.index = 0
  this.eof = false
  this.input = str
}

var pp = Tokenizer.prototype

pp.nextToken = function () {
  this.eatSpaces()
  return (
    this.readEOF() ||
    this.readLeftBrace() ||
    this.readRightBrace() ||
    this.readID() ||
    this.readString() ||
    this.readLeftBracket() ||
    this.readRightBracket() ||
    this.readComma() ||
    this.readColon() ||
    this.error()
  )
}

pp.eatSpaces = function () {
  var char = this.input[this.index];
  while (/^\s$/.test(char)) {
    this.index++
    char = this.input[this.index];
  }
}

pp.readLeftBrace = function () {
  if (this.input[this.index] === '{') {
    this.index++
    return {
      type: types.TK_LEFT_BRACE,
      label: '{'
    }
  }
}

pp.readRightBrace = function () {
  if (this.input[this.index] === '}') {
    this.index++
    return {
      type: types.TK_RIGHT_BRACE,
      label: '}'
    }
  }
}

pp.readID = function () {
  if (this.input[this.index].match(/[a-zA-Z_]/)) {
    var start = this.index
    this.index++
    while(this.input[this.index].match(/[a-zA-Z\d_]/)) {
      this.index++
    }
    return {
      type: types.TK_ID,
      label: this.input.slice(start, this.index)
    }
  }
}

pp.readString = function () {
  if (this.input[this.index] === '"') {
    var start = this.index
    this.index++
    while (this.input[this.index] !== '"') {
      this.index++
    }
    this.index++
    return {
      type: types.TK_STRING,
      label: this.input.slice(start + 1, this.index - 1)
    }
  }
}

pp.readLeftBracket = function () {
  if (this.input[this.index] === '[') {
    this.index++
    return {
      type: types.TK_LEFT_BRACKET,
      label: '['
    }
  }
}

pp.readRightBracket = function () {
  if (this.input[this.index] === ']') {
    this.index++
    return {
      type: types.TK_RIGHT_BRACKET,
      label: ']'
    }
  }
}

pp.readComma = function () {
  if (this.input[this.index] === ',') {
    this.index++
    return {
      type: types.TK_COMMA,
      label: ','
    }
  }
}

pp.readColon = function () {
  if (this.input[this.index] === ':') {
    this.index++
    return {
      type: types.TK_COLON,
      label: ':'
    }
  }
}

pp.readEOF = function () {
  if (this.index >= this.input.length) {
    this.eof = true
    return {
      type: types.TK_EOF,
      label: '$'
    }
  }
}

pp.error = function () {
  throw new Error('Unexpected token: ' + this.input[this.index])
}

pp.peekToken = function () {
  var index = this.index
  var token = this.nextToken()
  this.index = index
  return token
}

module.exports = Tokenizer
