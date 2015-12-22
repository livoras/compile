function tokenizer (str) {
  var tokens = str.split("").map(function (token) {
    return token.replace(/\s/g, '')
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
    }
  }
}

var stack = []
var tokens = null

function parse (input) {
  stack = ['S']
  tokens = tokenizer(input)
  return S()
}

function S () {
  if (tokens.peekToken() === '[') {
    
  }
}

var specs = [
  '[[a, b, c], [a, b], [b, a], a, b, [a]]',
  '[a, b, c, d]',
  '[a, [], [a]]'
]

specs.forEach(function (spec) {
  parse(spec);
  console.log('Passing ' + spec);
})
