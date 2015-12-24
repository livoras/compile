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

module.exports = tokenizer
