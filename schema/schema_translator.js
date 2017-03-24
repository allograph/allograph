var fs = require('fs');
var lingo = require('lingo')
var SchemaTranslator = function () {};

SchemaTranslator.prototype.printMetadata = function(dbMetadata) {
  writeToSchemaFile(graphQLData());
  writeGraphQLObjectSchema(dbMetadata);
  writeGraphQLQuerySchema(dbMetadata);
  writeGrpahQLMutationSchema(dbMetadata);

  writeGraphQLExport();
}

var singularCapitalizedTableName = function(name) {
  var singularName = lingo.en.singularize(name)
  return lingo.capitalize(singularName);
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

var knex = require('../database/connection')`
}

var writeToSchemaFile = function(data) {
  fs.writeFileSync('./schema/schema.js', data, 'utf-8');
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
  fields () {
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
    return 'new GraphQLList(' + lingo.capitalize(lingo.en.singularize(listType[1])) + ')';
  } else if (typeMap[psqlType]) {
    return typeMap[psqlType];
  } else if (timestamp) {
    return 'GraphQLString';
  } else {
    return lingo.en.singularize(psqlType);
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

var foreignKeyColumnData = function(column, tableName, pk_column, fk_column, psqlType) {
  var lowercaseTableName = tableName.toLowerCase();
  var listType = psqlType.match(/list\[(\w+)\]/);
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
          })
        }
      },`
}

var existingSchemaFileContents = function() {
  return fs.readFileSync('./schema/schema.js', 'utf-8');
}

var addToSchemaFile = function(newData) {
  var currentData = existingSchemaFileContents();
  writeToSchemaFile(currentData + newData);
}

var writeGraphQLObjectSchema = function(dbMetadata) {
  for (var property in dbMetadata.tables) {

    if (dbMetadata.tables.hasOwnProperty(property)) {
      var tableName = singularCapitalizedTableName(property);
      var description = dbMetadata.tables[property].description;

      var newData = objectDescription(tableName, description);

      for (var column in dbMetadata.tables[property].fields) {
        var psqlType = dbMetadata.tables[property].fields[column].data_type;

        if (dbMetadata.tables.hasOwnProperty(column)) {
          var fk_column = dbMetadata.tables[property].fields[column].fk_column
          var pk_column = dbMetadata.tables[property].fields[column].pk_column
          newData += foreignKeyColumnData(column, tableName, pk_column, fk_column, psqlType);
        } else {
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
    var tableName = singularCapitalizedTableName(property)

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

var mutationHeader = function() {
  return `\n\nconst Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {`
}

var writeGrpahQLMutationSchema = function(dbMetadata) {
  var newData = mutationHeader();
  for (var property in dbMetadata.tables) {
    if (dbMetadata.tables.hasOwnProperty(property)) {
      newData += mutationAdd(property, dbMetadata.tables[property]);
      newData += mutationUpdate(property, dbMetadata.tables[property]);
      newData += mutationDelete(property, dbMetadata.tables[property]);
    };
  };
  newData = newData.slice(0, -1);
  newData += closingBrackets();
  addToSchemaFile(newData);
};

var mutationAdd = function(pluralLowercaseTableName, tableData) {
  var singularLowercaseTableName = lingo.en.singularize(pluralLowercaseTableName);
  var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName);

  var newData = `\n      add${singularCapitalizedTableName}: {
        type: ${singularCapitalizedTableName},
        args: {`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;
    var pk_datatype = tableData.fields[column].pk_datatype;

    if (validForMutation(psqlType) && column !== 'id') {
      var graphQLType = psqlTypeToGraphQLType(psqlType);
      if (tableData.fields[column].is_nullable === 'NO') {
        newData += `\n          ${column}: {
            type: new GraphQLNonNull(${graphQLType})
          },`;
      } else {
        newData += `\n          ${column}: {
            type: ${graphQLType}
          },`;
      }
    } else if (pk_datatype) {
      var pk_graphQLType = psqlTypeToGraphQLType(pk_datatype);
      var fk_column = tableData.fields[column].fk_column;

      newData += `\n          ${fk_column}: {
            type: new GraphQLNonNull(${pk_graphQLType})
          },`;
    }
  }
  newData = newData.slice(0, -1);
  newData += `\n        },
        resolve (source, args) {
          return knex.returning('id').insert({`;

  for (var column in tableData.fields) {
    var pk_datatype = tableData.fields[column].pk_datatype;
    var psqlType = tableData.fields[column].data_type;
    var fk_column = tableData.fields[column].fk_column;

    if (validForMutation(psqlType) && column !== 'id') {
      newData += `\n            ${column}: args.${column},`;
    } else if (pk_datatype) {
      newData += `\n            ${fk_column}: args.${fk_column},`;
    }
  }

newData +=  `\n          }).into('${pluralLowercaseTableName}').then(id => {
            return knex('${pluralLowercaseTableName}').where({ id: id[0] }).then(${singularLowercaseTableName} => {
              return ${singularLowercaseTableName}[0];
            });
          });
        }
      },`

  return newData
}

var mutationUpdate = function(pluralLowercaseTableName, tableData) {
  var singularLowercaseTableName = lingo.en.singularize(pluralLowercaseTableName);
  var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName);

  var newData = `\n      update${singularCapitalizedTableName}: {
        type: ${singularCapitalizedTableName},
        args: {`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;
    if (validForMutation(psqlType)) {
      var graphQLType = psqlTypeToGraphQLType(psqlType);
      if (tableData.fields[column].is_nullable === 'NO') {
        newData += `\n          ${column}: {
            type: new GraphQLNonNull(${graphQLType})
          },`;
      } else {
        newData += `\n          ${column}: {
            type: ${graphQLType}
          },`;
      }
    }
  }
  newData = newData.slice(0, -1);
  newData += `\n        },
        resolve (source, args) {
          return knex('${pluralLowercaseTableName}').where({ id: args.id }).returning('id').update({`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;
    if (validForMutation(psqlType) && column !== 'id') {
      newData += `\n            ${column}: args.${column},`;
    }
  }

newData +=  `\n          }).then(id => {
            return knex('${pluralLowercaseTableName}').where({ id: id[0] }).then(${singularLowercaseTableName} => {
              return ${singularLowercaseTableName}[0];
            });
          });
        }
      },`

  return newData
}

var mutationDelete = function(pluralLowercaseTableName, tableData) {
  var singularLowercaseTableName = lingo.en.singularize(pluralLowercaseTableName);
  var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName);

  var newData = `\n      delete${singularCapitalizedTableName}: {
        type: ${singularCapitalizedTableName},
        args: {`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;
    if (validForMutation(psqlType) && column === 'id') {
      var graphQLType = psqlTypeToGraphQLType(psqlType);
      if (tableData.fields[column].is_nullable === 'NO') {
        newData += `\n          ${column}: {
            type: new GraphQLNonNull(${graphQLType})
          },`;
      } else {
        newData += `\n          ${column}: {
            type: ${graphQLType}
          },`;
      }
    }
  }
  newData = newData.slice(0, -1);
  newData += `\n        },
        resolve (source, args) {
          knex('${pluralLowercaseTableName}').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted ${pluralLowercaseTableName}: ' + numberOfDeletedItems);
          });
        }
      },`

  return newData
}

var validForMutation = function(psqlType) {
  var typeMap = {
        'character varying': 'GraphQLString',
        'integer': 'GraphQLInt'
      };
  return !!typeMap[psqlType];
}

var writeGraphQLExport = function() {
  var newData = `\n\nexports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});`
  addToSchemaFile(newData);
}

exports.SchemaTranslator = new SchemaTranslator();