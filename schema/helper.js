var fs = require('fs'),
    lingo = require('lingo');

var Helper = {
  toGraphQLTypeFromJSType: function(jsType) {
    var typemap = {
      'Int': 'GraphQLInt',
      'String': 'GraphQLString',
      'Boolean': 'GraphQLBoolean',
      'Int!': 'new GraphQLNonNull(GraphQLInt)',
      'String!': 'new GraphQLNonNull(GraphQLString)',
      'Boolean!': 'new GraphQLNonNull(GraphQLBoolean)',
    }

    return typemap[jsType]
  },
  customFieldType: function(customQueries, customQuery) {
    var typemap = {
      'Int': 'GraphQLInt',
      'String': 'GraphQLString',
      'Boolean': 'GraphQLBoolean',
      'Int!': 'new GraphQLNonNull(GraphQLInt)',
      'String!': 'new GraphQLNonNull(GraphQLString)',
      'Boolean!': 'new GraphQLNonNull(GraphQLBoolean)',
    }

    var type = (customQueries[customQuery].type);
    var newData = `\n      ${customQuery}: {`;

    if(type.toString().match(/\[(\w+)\]/)) {
      var baseGraphQLObjectType = type.toString().replace(/[\[\]]/g, "")
      newData += `\n          type: new GraphQLList(${baseGraphQLObjectType}),`
    } else if (typemap[type]) {
      newData += `\n          type: ${toGraphQLTypeFromJSType(type)},`
    } else {
      newData += `\n          type: ${type},`
    }

    newData += `\n          args: {`
    return newData;
  },
  helloWorld: function() {
    console.log('Hello World')
  },
  customArgsType: function(arg, type) {
    var typemap = {
      'Int': 'GraphQLInt',
      'String': 'GraphQLString',
      'Boolean': 'GraphQLBoolean',
      'Int!': 'new GraphQLNonNull(GraphQLInt)',
      'String!': 'new GraphQLNonNull(GraphQLString)',
      'Boolean!': 'new GraphQLNonNull(GraphQLBoolean)',
    }

    var newData = `\n          ${arg}: {`

    if(type.toString().match(/\[(\w+)\]/)) {
      var baseGraphQLObjectType = type.toString().replace(/[\[\]]/g, "")
      newData += `\n            type: new GraphQLList(${baseGraphQLObjectType})\n          },`
    } else {
      newData += `\n            type: ${typemap[type]}\n          },`
    }

    return newData
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