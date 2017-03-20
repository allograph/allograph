var fs = require('fs');
var SchemaTranslator = function () {};

SchemaTranslator.prototype.printMetadata = function(dbMetadata) {
  writeToSchemaFile(graphQLData());
  writeGraphQLObjectSchema(dbMetadata);
  writeGraphQLQuerySchema(dbMetadata);

  console.log("should start server here.")
}

var formatTableName = function(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

var graphQLData = function() {
  return `import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'`
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
  fields: () => {
    return {`  
}

var psqlTypeToGraphQLType = {
    'character varying': 'GraphQLString',
    'integer': 'GraphQLInt',
  }

var columnData = function(column, property, psqlType) {
  return '\n      ' + column + `: {
        type: ` + (psqlTypeToGraphQLType[psqlType] || 'GraphQLString') + `,
        resolve(` + property + `) {
          return ` + property + '.' + column + `;
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
        var psqlType = dbMetadata.tables[property].fields[column].data_type
        newData += columnData(column, property, psqlType);
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

    newData += queryResolveFunction(tableName)
  }

  newData += queryClosingBrackets();

  addToSchemaFile(newData);
}

var queryTableArgs = function(column, psqlType) {
  return `\n          ${column}: {
            type: ` + (psqlTypeToGraphQLType[psqlType] || 'GraphQLString') + `
          },`
}

var queryTableHeader = function(tableName) {
  return `\n      ${tableName}: {
        type: new GraphQLList(${tableName}),
        args: {`
}

var queryResolveFunction = function(tableName) {
  return `
        },
        resolve (root, args) {
          return Db.models.${tableName}.findAll({ where: args });
        }
      },`
}

var queryClosingBrackets = function() {
  return `\n    };
  }
});`
}

exports.SchemaTranslator = new SchemaTranslator();