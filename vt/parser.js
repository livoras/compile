var Tokenizer = require('./tokenizer')
var types = require('./tokentypes')

// TK_TEXT: 1,
// TK_IF: 2,
// TK_END_IF: 3,
// TK_ELSE_IF: 4,
// TK_ELSE: 5,
// TK_EACH: 6,
// TK_END_EACH: 7,
// TK_GT: 8,
// TK_SLASH_GT: 9,
// TK_TAG_NAME: 10,
// TK_ATTR_NAME: 11,
// TK_ATTR_EQUAL: 12,
// TK_ATTR_STRING: 13,
// TK_CLOSE_TAG: 13,
// TK_EOF: 100

function Parser (input) {
  this.tokens = new Tokenizer(input)
  this.parse()
}

var pp = Parser.prototype

pp.is = function (type) {
  return (this.tokens.peekToken().type === type)
}

pp.parse = function () {
  this.tokens.index = 0
  this.parseStat()
  this.eat(types.TK_EOF)
  console.log('Successfully parsed!');
}

pp.parseStat = function () {
  if (
    this.is(types.TK_IF) ||
    this.is(types.TK_EACH) ||
    this.is(types.TK_TAG_NAME) ||
    this.is(types.TK_TEXT)
  ) {
    this.parseFrag()
    this.parseStat()
  } else {// TODO: Follow check
    // end
  }
}

pp.parseFrag = function () {
  if (this.is(types.TK_IF)) return this.parseIfStat()
  else if (this.is(types.TK_EACH)) return this.parseEachStat()
  else if (this.is(types.TK_TAG_NAME)) return this.parseNode()
  else if (this.is(types.TK_TEXT)) {
    var token = this.eat(types.TK_TEXT)
    return token.label
  } else {
    this.parseError('parseFrag')
  }
}

/*
 * IfStat -> if Stat ElseIfs' Else '{/if}'
 */

pp.parseIfStat = function () {
  this.eat(types.TK_IF)
  this.parseStat()
  this.parseElseIfsPrimer()
  this.parseElse()
  this.eat(types.TK_END_IF)
}

/*
 * ElseIfs' -> ElseIfs ElseIfs'|e
 */

pp.parseElseIfsPrimer = function () {
  if (this.is(types.TK_ELSE_IF)) {
    this.parseElseIfs()
    this.parseElseIfsPrimer()
  } else if (
    this.is(types.TK_ELSE) ||
    this.is(types.TK_END_IF)
  ) {
    // do nothing
  } else {
    this.parseError('parseElseIfsPrimer')
  } 
}

/*
 * ElseIfs -> elseif Stat
 */

pp.parseElseIfs = function () {
  this.eat(types.TK_ELSE_IF)
  this.parseStat()
}

/*
 * Else -> '{else}' Stat|e
 */

pp.parseElse = function () {
  if (this.is(types.TK_ELSE)) {
    this.eat(types.TK_ELSE)
    this.parseStat()
  } else if (
    this.is(types.TK_END_IF) 
  ) {
    // do nothing
  } else {
    parseError('parseElse')
  }
}

/* 
 * EachStat -> each Stat '{/each}'
 */

pp.parseEachStat = function () {
  this.eat(types.TK_EACH)
  this.parseStat()
  this.eat(types.TK_END_EACH)
}

/*
 * Node -> OpenTag NodeTail
 */

pp.parseNode = function () {
  this.parseOpenTag()
  this.parseNodeTail()
}

/*
 * OpenTag -> tagName Attrs
 */

pp.parseOpenTag = function () {
  this.eat(types.TK_TAG_NAME)
  this.parseAttrs()
}

/*
 * NodeTail -> '>' Stat closeTag
 *           | '/>'
 */

pp.parseNodeTail = function () {
  if (this.is(types.TK_GT)) {
    this.eat(types.TK_GT)
    this.parseStat()
    this.eat(types.TK_CLOSE_TAG)
  } else if (this.is(types.TK_SLASH_GT)) {
    this.eat(types.TK_SLASH_GT)
  } else {
    this.parseError('parseNodeTail')
  }
}

pp.parseAttrs = function () {
  if (this.is(types.TK_ATTR_NAME)) {
    this.parseAttr()
    this.parseAttrs()
  } else if (
    this.is(types.TK_GT) ||
    this.is(types.TK_SLASH_GT)
  ) {
    // do nothing
  } else {
    this.parseError('parseAttrs')
  }
}

pp.parseAttr = function () {
  this.eat(types.TK_ATTR_NAME)
  this.parseValue()
}

pp.parseValue = function () {
  if (
    this.is(types.TK_ATTR_EQUAL)
  ) {
    this.eat(types.TK_ATTR_EQUAL)
    this.eat(types.TK_ATTR_STRING)
  } else if (
    this.is(types.TK_GT) ||
    this.is(types.TK_SLASH_GT) ||
    this.is(types.TK_ATTR_NAME)
  ) {
    // do nothing
  } else {
    this.parseError('parseValue')
  }
}

pp.error = function (msg) {
  throw new Error('Parse Error: ' + msg)
}

pp.parseError = function (name) {
  var token = this.tokens.peekToken()
  this.error('in ' + name + ', unexpected token \'' + token.label + '\'')
}

pp.eat = function (type) {
  var token = this.tokens.nextToken()
  if (token.type !== type) {
    this.error('expect token type ' + type + ', but got ' + token.type)
  }
  return token
}

module.exports = Parser
