var fs = require('fs'),
    lingo = require('lingo'),
    inputCustomMutations = fs.readFileSync('./schema/mutations.js', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),
    queries = require('./queries.js').Query;

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  // writeGraphQLClassModels(dbMetadata);
  // writeMutationsFile(dbMetadata);
  // writeQueriesFile(dbMetadata);
  writeTypesFile(dbMetadata);
  // writeSchemaDefinition();
}


// Translating to GraphQL Type starts here
var graphQLData = function() {
  return `import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';`
}

var objectDescription = function(tableName, description) {
  return `\n
const ` + tableName + ` = new GraphQLObjectType({
  name: '` + tableName + `',
  description: '` + description + `',
  fields: () => {
    return {`
}

var singularCapitalizedTableName = function(name) {
  var singularName = lingo.en.singularize(name)
  return lingo.capitalize(singularName);
}

var foreignKeyColumnData = function(column, tableName, pk_column, fk_column, psqlType) {
  var lowercaseTableName = tableName.toLowerCase();
  var listType = psqlType.match(/\[(\w+)\]/);
  var args;
  var retuenValue = `${column}`;

  if (listType) {
    args = `{ ${fk_column}: ${lowercaseTableName}.${pk_column} }`
  } else {
    args = `{ ${pk_column}: ${lowercaseTableName}.${fk_column} }`
    retuenValue = `${column}[0]`
  }

  return '\n      ' + column + `: {
        type: ` + psqlTypeToGraphQLType(psqlType) + `,
        resolve (` + lowercaseTableName + `) {
          return knex('${column}').where(` + args + `).then(${column} => {;
            return ` + retuenValue + `;
          });
        }
      },`
}

var columnData = function(column, table, psqlType, is_nullable) {
  var typeData = `\n        type: `
  if (!is_nullable) {
    typeData += `new GraphQLNonNull(` + psqlTypeToGraphQLType(psqlType) + `),`
  } else {
    typeData += psqlTypeToGraphQLType(psqlType) + `,`
  }

  return '\n      ' + column + `: {` + typeData +
`\n        resolve (` + lingo.en.singularize(table) + `) {
          return ` + lingo.en.singularize(table) + '.' + column + `;
        }
      },`
}

var closingBrackets = function() {
  return `
    };
  }
});`
}

var writeTypesFile = function(dbMetadata) {
  var data = graphQLData();
  for (var table in dbMetadata.tables) {

    if (dbMetadata.tables.hasOwnProperty(table)) {

      var objTypeName = singularCapitalizedTableName(table);
      var description = dbMetadata.tables[table].description;
      data += objectDescription(objTypeName, description);

      for (var column in dbMetadata.tables[table].fields) {
        var psqlType = dbMetadata.tables[table].fields[column].data_type;
        var is_nullable = dbMetadata.tables[table].fields[column].is_nullable;

        if (dbMetadata.tables.hasOwnProperty(column)) {
          var fk_column = dbMetadata.tables[table].fields[column].fk_column
          var pk_column = dbMetadata.tables[table].fields[column].pk_column
          data += foreignKeyColumnData(column, objTypeName, pk_column, fk_column, psqlType);
        } else {
          data += columnData(column, table, psqlType, is_nullable);
        }
      }

      data += closingBrackets();
    };
  };
  fs.writeFileSync('./generated/type_definitions.js', data, 'utf-8')
}
// Translating to GraphQL Type ends here

var writeQueriesFile = function(dbMetadata) {
  var customMutations = queries;
  console.log(queries);

  var newData = `const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () {
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
  var listType = psqlType.match(/\[(\w+)\]/),
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