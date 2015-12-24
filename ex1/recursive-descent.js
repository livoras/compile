var tokenizer = require('./tokenizer')
var tokens = null

function parse (input) {
  tokens = tokenizer(input)
  S()
  
  if (!tokens.end()) {
    error('Passing error')
  }
}

function S () {
  if (tokens.token === '[') {
    match('[')
    K()
  } else {
    error('Not match S')
  }
}

function K () {
  if (tokens.isID()) {
    match('id')
    A()
    match(']')
  } else if (
    (tokens.token === '[') ||
    (tokens.token === ',') ||
    (tokens.token === ']')
  ) {
    B()
    A()
    match(']')
  } else {
    error('Not match in K')
  }
}

function B () {
  if (tokens.token === '[') {
    S()
  } else if (
    (tokens.token === ',') ||
    (tokens.token === ']')
  ) {
    // do nothing
  } else {
    error('Not match in B')
  }
}

function A () {
  if (tokens.token === ',') {
    match(',')
    C()
  } else if (tokens.token === ']') {
    // do nothing
  } else {
    error('Not match in A')
  }
}

function C () {
  if (tokens.token === '[') {
    S()
    A()
  } else if (tokens.isID()) {
    match('id')
    A()
  } else {
    error('Not match in C')
  }
}

function error (msg) {
  throw new Error(msg || 'Not success!!')
}

function match (token) {
  if ((tokens.isID() && token === 'id') || (token === tokens.token)) {
    tokens.nextToken()
  } else {
    console.log(token, tokens.token)
    error('Not match')
  }
}

var specs = [
  '[]',
  '[a]',
  '[a, b, c, d]',
  '[[a, b, c], [a, b], [b, a], a, b, [a]]',
  '[a, [], [a]]',
  '[a, [], c, [a]]',
  '[, a, b]',
  // '[]]',
  // '[[[[], [a, [[[b]]]]]]]]]]]]]]]]]]]]]]]]a, b,]'
]

specs.forEach(function (spec) {
  console.log('============== starting ==============', spec)
  parse(spec);
  console.log('Passing ' + spec);
})

