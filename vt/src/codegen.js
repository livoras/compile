var _ = require('./util')
var codeGenMethods = {}

function CodeGen (astRoot) {
  this.nodeIndex = 1
  this.lines = []
  this.walkRoot(astRoot)
  console.log(this.lines.join('\n'));
}

var pp = CodeGen.prototype

pp.walkRoot = function (astRoot) {
  this.walk(astRoot, '  ', 0)
}

pp.walk = function (node, indent, parentIndex) {
  if (typeof node === 'string') {
    return this.genString(node, indent, parentIndex)
  } else {
    return this['gen' + node.type](node, indent, parentIndex)
  }
}

pp.genStat = function (node, indent, parentIndex) {
  var self = this
  _.each(node.members, function (item) {
    self.walk(item, indent, parentIndex)
  })
}

pp.genIfStat = function (node, indent, parentIndex) {
  // body...
  var expr = node.label.replace(/(^\{\s*if\s*)|(\s*\}$)/g, '')
  this.lines.push('\n' + indent + 'if (' + expr + ') {')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
  // this.lines.push(indent + '}')
  if (node.elseifs) {
    var self = this
    _.each(node.elseifs, function (elseif) {
      self.walk(elseif, indent, parentIndex)
    })
  }
  if (node.elsebody) {
    this.lines.push(indent + '} else {')
    this.walk(node.elsebody, inc(indent), parentIndex)
  }
  this.lines.push(indent + '}\n')
}

pp.genElseIf = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*else\s*if\s*)|(\s*\}$)/g, '')
  this.lines.push(indent + '} else if (' + expr + ') {')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
  // this.lines.push(indent + '}')
}

pp.genEachStat = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*each\s*)|(\s*\}$)/g, '')
  var tokens = expr.split(/\s+/)
  var list = tokens[0]
  var item = tokens[2]
  var key = tokens[3]
  this.lines.push(
    '\n' +
    indent +
    'for (var ' + key + ' = 0, len = ' + list + '.length; i < len; i++) {'
  )
  this.lines.push(inc(indent) + 'var ' + item + ' = ' + 'list[' + key + '];')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
  this.lines.push(indent + '}\n')
}

pp.genNode = function (node, indent, parentIndex) {
  var currentIndex = this.nodeIndex++
  this.lines.push(
    indent +
    'var node' + 
    currentIndex + ' = el("' + node.name + 
    '", ' + pp.getAttrs(node) + ', []);'
  )
  this.lines.push(
    indent +
    'node' + parentIndex + '.children.push(node' + currentIndex + ')'
  )
  if (node.body) {
    this.walk(node.body, indent, currentIndex)
  }
}

pp.genString = function (node, indent, parentIndex) {
  this.lines.push(
    indent + 'node' + parentIndex + '.children.push("' + node + '")'
  )
}

pp.getAttrs = function (node) {
  var str = '{'
  var attrs = node.attributes
  var i = 0;
  for (var key in attrs) {
    if (i++ != 0) {
      str += (', ' + key + ': "' + attrs[key] + '"')
    } else {
      str += (key + ': "' + attrs[key] + '"')
    }
  }
  str += '}'
  return str;
}

function inc (indent) {
  return indent + '  '
}

module.exports = CodeGen
