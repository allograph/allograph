var fs = require('fs'),
    lingo = require('lingo');

var Helper = {
  toGraphQLTypeFromJSType: function(jsType) {
    var typemap = {
      'Int': 'GraphQLInt',
      'String': 'GraphQLString',
      'Boolean': 'GraphQLBoolean',
    }

    return typemap[jsType] || 'GraphQLString'
  },
  singularCapitalizedTableName: function(name) {
    var singularName = lingo.en.singularize(name)
    return lingo.capitalize(singularName);
  }
}

module.exports = Helper;