var types = require('./types')
var tokens;
var util = require('util');

function is (type, token) {
  return token.type === type
}

function parse (_tokens) {
  tokens = _tokens;
  if (is(types.TK_LEFT_BRACE, tokens.peekToken())) {
    var root = parseObj()
  } else if (is(types.TK_LEFT_BRACKET, tokens.peekToken())) {
    var root = parseArr()
  }
  eat(types.TK_EOF) /* check for totally parsed */
  console.log('Successfully parsed!')
  return root
}

function parseObj () {
  var obj = {}
  eat(types.TK_LEFT_BRACE)
  parsePairsPrimer(obj)
  eat(types.TK_RIGHT_BRACE)
  return obj
}

function parsePairsPrimer (obj) {
  if (
    is(types.TK_ID, tokens.peekToken()) ||
    is(types.TK_STRING, tokens.peekToken())
  ) {
    return parsePairs(obj)
  } else if (is(types.TK_RIGHT_BRACE, tokens.peekToken())) {
    // do nothing
  } else {
    error('Parse PairsPrimer, Unexpected Token ' + tokens.peekToken().label)
  }
}

function parsePairs (obj) {
  parseKeyValue(obj)
  parsePairsTail(obj)
}

function parseKeyValue (obj) {
  var key = parseKey()
  eat(types.TK_COLON)
  var value = parseValue()
  obj[key] = value
}

function parseKey () {
  var token = tokens.peekToken()
  if (is(types.TK_STRING, token)) {
    eat(types.TK_STRING)
    return token.label
  } else if (is(types.TK_ID, token)) {
    eat(types.TK_ID)
    return token.label
  } else {
    error('Parse Error in ParseKey ' + tokens.peekToken().label)
  }
}

function parseValue () {
  var token = tokens.peekToken()
  if (is(types.TK_LEFT_BRACE, token)) {
    return parseObj()
  } else if (is(types.TK_LEFT_BRACKET, token)) {
    return parseArr()
  } else if (is(types.TK_ID, token)) {
    eat(types.TK_ID)
    return token.label
  } else if (is(types.TK_STRING, token)) {
    eat(types.TK_STRING)
    return token.label
  } else {
    error('Parse Error in ParseValue ' + tokens.peekToken().label)
  }
}

function parsePairsTail (obj) {
  var token = tokens.peekToken()
  if (is(types.TK_COMMA, token)) {
    eat(types.TK_COMMA)
    parseKeyValue(obj)
    parsePairsTail(obj)
  } else if (is(types.TK_RIGHT_BRACE, token)) {
    // do nothing
  } else {
    error('Parse Error in ParsePairsTail ' + tokens.peekToken().label)
  }
}

function eat(type) {
  var nextToken = tokens.nextToken()
  if (nextToken.type !== type) {
    error('Unexpected Token ' + nextToken.label)
  }
}

function parseArr () {
  var arr = []
  var token = tokens.peekToken()
  eat(types.TK_LEFT_BRACKET)
  arr.push.apply(arr, parseItemsPrimer())
  eat(types.TK_RIGHT_BRACKET)
  return arr
}

function parseItemsPrimer () {
  var token = tokens.peekToken()
  if (
    is(types.TK_LEFT_BRACE, token) ||
    is(types.TK_LEFT_BRACKET, token) ||
    is(types.TK_STRING, token) ||
    is(types.TK_ID, token)
  ) {
    return parseItems()
  } else if (is(types.TK_RIGHT_BRACKET, token)) {
    // do nothing
  } else {
    error('Parse Error in parseItemsPrimer')
  }
}

function parseItems () {
  var items = []
  items.push(parseValue())
  items.push.apply(items, parseItemsTail())
  return items;
}

function parseItemsTail() {
  var items = []
  if (is(types.TK_COMMA, tokens.peekToken())) {
    eat(types.TK_COMMA)
    items.push(parseValue())
    items.push.apply(items, parseItemsTail())
    return items;
  } else if (is(types.TK_RIGHT_BRACKET, tokens.peekToken())) {
    // do nothing
  } else {
    error('Parse Error in parseItemsTail')
  }
}

function error (msg) {
  throw new Error('Parser Error: ' + msg)
}

module.exports = {
  parse: parse
}
