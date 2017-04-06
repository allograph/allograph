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
  },
  toCamelCase: function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }
}

module.exports = Helper;