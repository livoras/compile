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
    peekToken: function () {
      return tokens[this.i + 1]
    },
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
    } else if (last === 'C') {
      C()
    } else if (last.match(/[a-z]/)) {
      match('id')
    } else {
      match(last)
    }
    // console.log(stack, 'stack')
  }
  if (stack.length !== 0 && tokens.end()) {
    error('parse errors!')
  }
}

function S () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push('B', '[')
  } else {
    error('Not match [ in S')
  }
}

function B () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push(']', 'K', 'S')
  } else if (tokens.isID()) {
    stack.push(']', 'K', 'id')
  } else if (tokens.token === ']') {
    stack.push(']')
  } else {
    error('parse error in B')
  }
}

function K () {
  stack.pop()
  if (tokens.token === ']') {
    // do nothing
  } else if (tokens.isID()) {
    stack.push('id')
  } else if (tokens.token === ',') {
    stack.push('C', ',')
  } else {
    error('parse error in K')
  }
}

function C () {
  stack.pop()
  if (tokens.token === '[') {
    stack.push('K', 'S')
  } else if (tokens.isID()) {
    stack.push('K', 'id')
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
  '[a, [], c, [a]]'
]

specs.forEach(function (spec) {
  console.log('============== starting ==============', spec)
  parse(spec);
  console.log('Passing ' + spec);
})
