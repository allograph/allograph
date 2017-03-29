var fs = require('fs'),
    lingo = require('lingo'),
    inputCustomMutations = fs.readFileSync('./schema/mutations.js', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),
    queries = require('./queries.js');

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  // writeGraphQLClassModels(dbMetadata);
  // writeMutationsFile(dbMetadata);
  writeQueriesFile(dbMetadata);
  // writeTypesFile(dbMetadata);
  // writeSchemaDefinition();
}

var writeQueriesFile = function(dbMetadata) {
  var customMutations = queries;
  console.log(queries);

  var newData = `const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {`

  for (var property in dbMetadata.tables) {
    var tableName = h.singularCapitalizedTableName(property)

    newData += queryTableHeader(tableName)

    for (var column in dbMetadata.tables[property].fields) {
      var psqlType = dbMetadata.tables[property].fields[column].data_type;
      var typeMap = {
            'character varying': 'GraphQLString',
            'integer': 'GraphQLInt'
          };

      if (typeMap[psqlType]) {
        newData += queryTableArgs(column, psqlType);
      }
    }

    newData = newData.slice(0, -1);
    newData += queryResolveFunction(tableName)
  }

  newData += queryClosingBrackets();

  fs.writeFileSync('./generated/mutations.js', newData, 'utf-8')
}

var queryTableArgs = function(column, psqlType) {
  return `\n          ${column}: {
            type: ` + psqlTypeToGraphQLType(psqlType) + `
          },`
}

var queryTableHeader = function(tableName) {
  var lowercasePluralTableName = lingo.en.pluralize(tableName.toLowerCase());

  return `\n      ${lowercasePluralTableName}: {
        type: new GraphQLList(${tableName}),
        args: {`
}

var psqlTypeToGraphQLType = function(psqlType) {
  var listType = psqlType.match(/list\[(\w+)\]/),
      timestamp = psqlType.match(/^timestamp/),
      typeMap = {
        'character varying': 'GraphQLString',
        'integer': 'GraphQLInt'
      }

  if (listType) {
    return 'new GraphQLList(' + lingo.capitalize(lingo.en.singularize(listType[1])) + ')';
  } else if (typeMap[psqlType]) {
    return typeMap[psqlType];
  } else if (timestamp) {
    return 'GraphQLString';
  } else {
    return lingo.en.singularize(psqlType);
  }
}

var queryResolveFunction = function(tableName) {
  var lowercasePluralTableName = lingo.en.pluralize(tableName.toLowerCase());
  return `
        },
        resolve (root, args) {
          return knex('${lowercasePluralTableName}').where(args)
        }
      },`
}

var queryClosingBrackets = function() {
  return `\n    };
  }
});`
}

exports.GraphqlGenerator = new GraphqlGenerator();