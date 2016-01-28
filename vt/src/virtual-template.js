var CodeGen = require('./codegen')
var Parser = require('./parser')
var svd = require('simple-virtual-dom')

var vTemplate = {}

vTemplate.compile = function (template) {
  var astRoot = (new Parser(template)).parse()
  var code = new CodeGen(astRoot)
  return function (data) {
    var params = []
    for (var key in data) {
      params.push(key)
    }
    params.push('_el_', 'node_')
    var renderFunc = new Function('_data_', '_el_', 'node_', code.body)
    var container = svd.el('div')
    renderFunc(data, svd.el, container)
    consolo.log(container);
  }
}

module.exports = vTemplate

