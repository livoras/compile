var _ = require('./util')
var codeGenMethods = {}

function walkRoot (astRoot) {
  var lines = []
  walk(astRoot, lines)
}

function walk (node, lines) {
  if (typeof node === 'string') {
    return codeGenMethods['String'](node, lines)
  } else {
    return codeGenMethods[node.type](node, lines)
  }
}

codeGenMethods['Stat'] = function (node, lines) {
  _.each(node.members, function (item) {
    walk(item, lines)
  })
}

codeGenMethods['IfStat'] = function (node, lines) {
  // body...
  if (node.body) {
    walk(node.body, lines)
  }
  if (node.elseifs) {
    _.each(node.elseifs, function (elseif) {
      walk(elseif, lines)
    })
  }
  if (node.elsebody) {
    walk(node.elsebody)
  }
}

codeGenMethods['ElseIf'] = function (node, lines) {
  if (node.body) {
    walk(node.body, lines)
  }
}

codeGenMethods['EachStat'] = function (node, lines) {
  if (node.body) {
    walk(node.body, lines)
  }
}

codeGenMethods['Node'] = function (node, lines) {
  if (node.body) {
    walk(node.body, lines)
  }
}

codeGenMethods['String'] = function (node, lines) {
}

module.exports = walkRoot
