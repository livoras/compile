function tokenizer (str) {
  var tokens = []
  str.split("").forEach(function (token) {
    token = token.replace(/\s/g, '')
    if (token.length !== 0) {
      tokens.push(token)
    }
  });

  return {
    i: 0,
    tokens: tokens,
    token: tokens[0],
    nextToken: function () {
      this.token = tokens[++this.i]
      return this.token
    },
    end: function () {
      return this.i === tokens.length
    },
    isID: function () {
      return this.token.match(/[a-z]/)
    }
  }
}

var stack = []
var tokens = null

function parse (input) {
  stack = ['S']
  tokens = tokenizer(input)
  while (stack.length !== 0) {
    var last = stack[stack.length - 1]
    if (last === 'S') {
      S()
    } else if (last === 'B') {
      B()
    } else if (last === 'K') {
      K()
    } else if (last === 'A') {
      A()
    } else if (last === 'C') {
      C()
    } else if (last.match(/[a-z]/)) {
      match('id')
    } else {
      match(last)
    }
    console.log(stack, 'stack')
  }
  if (stack.length !== 0 && tokens.end()) {
    error('parse errors!')
  }
}

function S () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push('K', '[')
  } else {
    error('Not match [ in S')
  }
}

function K () {
  stack.pop()
  if (tokens.isID()) {
    stack.push(']', 'A', 'id')
  } else if (tokens.token === '[' || tokens.token === ',' || tokens.token === ']') {
    stack.push(']', 'B', 'A')
  } else {
    error('parse error in K')
  }
}

function B () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push('S')
  } else if (tokens.token === ',' || tokens.token === ']') {
    // do nothing
  } else {
    error('parse error in B')
  }
}

function A () {
  stack.pop()
  if (tokens.token === ',') {
    stack.push('C', ',')
  } else if (tokens.token === ']') {
    // do nothing
  } else {
    error('parse error in A')
  }
}


function C () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push('A', 'S')
  } else if (tokens.isID()) {
    stack.push('A', 'id')
  } else {
    error('parse in C')
  }
}

function match (token) {
  if ((tokens.isID() && token === 'id') || (token === tokens.token)) {
    stack.pop()
    tokens.nextToken()
  } else {
    console.log(token, tokens.token)
    error('Not match')
  }
}

function error (msg) {
  throw new Error(msg || 'Not success!!')
}

var specs = [
  '[]',
  '[a]',
  '[a, b, c, d]',
  '[[a, b, c], [a, b], [b, a], a, b, [a]]',
  '[a, [], [a]]',
  '[a, [], c, [a]]',
  '[[[[], [a, [[[b]]]]]]]]]]]]]]]]]]]]]]]]a, b,]'
]

specs.forEach(function (spec) {
  console.log('============== starting ==============', spec)
  parse(spec);
  console.log('Passing ' + spec);
})
