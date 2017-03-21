var fs = require('fs');
var lingo = require('lingo')
var SchemaTranslator = function () {};
const graphQLServer = require('./server.js').GraphQLServer;

SchemaTranslator.prototype.printMetadata = function(dbMetadata) {
  writeToSchemaFile(graphQLData());
  writeGraphQLObjectSchema(dbMetadata);
  writeGraphQLQuerySchema(dbMetadata);
  writeGraphQLExport();

  graphQLServer.run();
}

var formatTableName = function(name) {
  var singularName = lingo.en.singularize(name)
  return lingo.capitalize(singularName);
  // return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

var graphQLData = function() {
  return `import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var knex = require('knex')({
  client: 'pg',
  connection: "postgresql://rachelminto:postgres@localhost/relay",
  searchPath: 'knex,public'
});`
}

var writeToSchemaFile = function(data) {
  fs.writeFileSync('schema.js', data, 'utf-8');
}

var closingBrackets = function() {
  return `
    };
  }
});`
}

var objectDescription = function(tableName, description) {
  return `\n
const ` + tableName + ` = new GraphQLObjectType({
  name: '` + tableName + `',
  description: '` + description + `',
  fields () => {
    return {`
}

var psqlTypeToGraphQLType = function(psqlType) {
  var listType = psqlType.match(/list\[(\w+)\]/),
      timestamp = psqlType.match(/^timestamp/),
      typeMap = {
        'character varying': 'GraphQLString',
        'integer': 'GraphQLInt'
      }

  if (listType) {
    return 'GraphQLList(' + listType[1] + ')';
  } else if (typeMap[psqlType]) {
    return typeMap[psqlType];
  } else if (timestamp) {
    return 'GraphQLString';
  } else {
    return psqlType;
  }
}

var columnData = function(column, property, psqlType) {
  return '\n      ' + column + `: {
        type: ` + psqlTypeToGraphQLType(psqlType) + `,
        resolve (` + lingo.en.singularize(property) + `) {
          return ` + lingo.en.singularize(property) + '.' + column + `;
        }
      },`
}

var foreignKeyColumnData = function(column, tableName, pk_column, fk_column) {
  lowercaseTableName = tableName.toLowerCase();
  singularLowercaseTableName = lingo.en.singularize(lowercaseTableName)
  singularColumnName = lingo.en.singularize(column)
  singularUppercaseColumnName = lingo.capitalize(singularColumnName)

  return '\n      ' + column + `: {
        type: new GraphQLList(` + singularUppercaseColumnName + `),
        resolve (` + lowercaseTableName + `) {
          return knex('${column}').where({ ${fk_column}: ${lowercaseTableName}.${pk_column} }).then(${column} => {;
            return ${column};        
          })
        }
      },`
}

var existingSchemaFileContents = function() {
  return fs.readFileSync('schema.js', 'utf-8');
}

var addToSchemaFile = function(newData) {
  var currentData = existingSchemaFileContents();
  writeToSchemaFile(currentData + newData);
}

var writeGraphQLObjectSchema = function(dbMetadata) {
  for (var property in dbMetadata.tables) {

    if (dbMetadata.tables.hasOwnProperty(property)) {

      var tableName = formatTableName(property)
      var description = dbMetadata.tables[property].description

      var newData = objectDescription(tableName, description);

      for (var column in dbMetadata.tables[property].fields) {
        if (dbMetadata.tables.hasOwnProperty(column)) {
          var fk_column = dbMetadata.tables[property].fields[column].fk_column
          var pk_column = dbMetadata.tables[property].fields[column].pk_column
          newData += foreignKeyColumnData(column, tableName, pk_column, fk_column);
        } else {
          var psqlType = dbMetadata.tables[property].fields[column].data_type
          newData += columnData(column, property, psqlType);
        }
      }

      newData += closingBrackets();
      addToSchemaFile(newData);
    };
  };
}

var writeGraphQLQuerySchema = function(dbMetadata) {
  var newData = `\n\nconst Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {`

  for (var property in dbMetadata.tables) {
    var tableName = formatTableName(property)

    newData += queryTableHeader(tableName)

    for (var column in dbMetadata.tables[property].fields) {
      var psqlType = dbMetadata.tables[property].fields[column].data_type
      newData += queryTableArgs(column, psqlType);
    }

    newData = newData.slice(0, -1);
    newData += queryResolveFunction(tableName)
  }

  newData += queryClosingBrackets();

  addToSchemaFile(newData);
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

var queryResolveFunction = function(tableName) {
  lowercasePluralTableName = lingo.en.pluralize(tableName.toLowerCase());
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

var writeGraphQLExport = function() {
  var newData = `\n\nexports.Schema = new GraphQLSchema({
  query: Query
});`
  addToSchemaFile(newData);
}

exports.SchemaTranslator = new SchemaTranslator();