var _ = require('./util')
var codeGenMethods = {}

function walkRoot (astRoot) {
  var lines = []
  walk(astRoot, lines, 0)
  console.log(lines.join('\n'))
}

function walk (node, lines, indent) {
  if (typeof node === 'string') {
    return codeGenMethods['String'](node, lines, indent)
  } else {
    return codeGenMethods[node.type](node, lines, indent)
  }
}

codeGenMethods['Stat'] = function (node, lines, indent) {
  _.each(node.members, function (item) {
    walk(item, lines, indent)
  })
}

codeGenMethods['IfStat'] = function (node, lines, indent) {
  // body...
  var expr = node.label.replace(/(^\{\s*if\s*)|(\s*\}$)/g, '')
  lines.push(spaces(indent) + 'if (' + expr + ') {')
  if (node.body) {
    walk(node.body, lines, inc(indent))
  }
  lines.push(spaces(indent) + '}')
  if (node.elseifs) {
    _.each(node.elseifs, function (elseif) {
      walk(elseif, lines, indent)
    })
  }
  lines.push(spaces(indent) + 'else {')
  if (node.elsebody) {
    walk(node.elsebody, lines, inc(indent))
  }
  lines.push(spaces(indent) + '}')
}

codeGenMethods['ElseIf'] = function (node, lines, indent) {
  var expr = node.label.replace(/(^\{\s*else\s*if\s*)|(\s*\}$)/g, '')
  lines.push(spaces(indent) + 'else if (' + expr + ') {')
  if (node.body) {
    walk(node.body, lines, indent + 2)
  }
  lines.push(spaces(indent) + '}')
}

codeGenMethods['EachStat'] = function (node, lines, indent) {
  var expr = node.label.replace(/(^\{\s*each\s*)|(\s*\}$)/g, '')
  var tokens = expr.split(/\s+/)
  var list = tokens[0]
  var item = tokens[2]
  var key = tokens[3]
  lines.push(
    spaces(indent) +
    'for (var ' + key + ' = 0, len = ' + list + '.length; i < len; i++) {'
  )
  lines.push(spaces(inc(indent)) + 'var ' + item + ' = ' + 'list[' + key + '];')
  if (node.body) {
    walk(node.body, lines, inc(indent))
  }
  lines.push(spaces(indent) + '}')
}

codeGenMethods['Node'] = function (node, lines, indent) {
  if (node.body) {
    walk(node.body, lines, indent)
  }
}

codeGenMethods['String'] = function (node, lines, indent) {
}

function inc (indent) {
  return indent + 2
}

function spaces (indent) {
  var str = '';
  for (var i = 0; i < indent; i++) {
    str += ' '
  }
  return str
}

module.exports = walkRoot
