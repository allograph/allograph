var fs = require('fs'),
    lingo = require('lingo'),
    inputCustomMutations = fs.readFileSync('./schema/mutations.js', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),
    query = require('./queries.js').Query;

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';    

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  // writeGraphQLClassModels(dbMetadata);
  writeMutationsFile(dbMetadata);
  writeQueriesFile(dbMetadata);
  writeTypesFile(dbMetadata);
  writeSchemaDefinition();
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
} from 'graphql';


var knex = require('../database/connection')`
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
  var returnValue = `${column}`;

  if (listType) {
    args = `{ ${fk_column}: ${lowercaseTableName}.${pk_column} }`
  } else {
    args = `{ ${pk_column}: ${lowercaseTableName}.${fk_column} }`
    returnValue = `${column}[0]`
  }

  return '\n      ' + column + `: {
        type: ` + psqlTypeToGraphQLType(psqlType) + `,
        resolve (` + lowercaseTableName + `) {
          return knex('${column}').where(` + args + `).then(${column} => {;
            return ` + returnValue + `;
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

  data += '\n\n'
  fs.writeFileSync('./generated/type_definitions.js', data, 'utf-8')
}
// Translating to GraphQL Type ends here

// Write Queries Begins

var writeQueriesFile = function(dbMetadata) {
  var newData = `const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {`

  var customQueries = query.fields();

  for (var customQuery in customQueries) {
    if (Object.keys(customQueries[customQuery]).length === 0) { continue; }

    newData += `\n      ${customQuery}: {
        type: ${h.toGraphQLTypeFromJSType(customQueries[customQuery].type)}, 
        args: {`

    for (var arg in customQueries[customQuery].args) {
      newData += `\n          ${arg}: {
            type: ${h.toGraphQLTypeFromJSType(customQueries[customQuery].args[arg].type)}\n          },`
    }

    newData += `\n        },\n        ` 
    newData += customQueries[customQuery].resolve.toString()
    newData += `\n      },`
  }

  for (var property in dbMetadata.tables) {
    var tableName = h.singularCapitalizedTableName(property)

    if (Object.keys(customQueries).includes(property)) { continue; }

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
  newData += '\n\n'

  fs.writeFileSync('./generated/queries.js', newData, 'utf-8')
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

// writeQueries ends here

// writeMutations starts here

var writeMutationsFile = function(dbMetadata) {
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
  fs.writeFileSync('./generated/mutations.js', newData, 'utf-8')
};

var mutationHeader = function() {
  return `const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {`
}

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
      if (!tableData.fields[column].is_nullable) {
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
      if (!tableData.fields[column].is_nullable) {
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
        type: GraphQLString,
        args: {`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;
    if (validForMutation(psqlType) && column === 'id') {
      var graphQLType = psqlTypeToGraphQLType(psqlType);
      if (!tableData.fields[column].is_nullable) {
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
          return knex('${pluralLowercaseTableName}').where({ id: args.id }).del().then(numberOfDeletedItems => {
            return 'Number of deleted ${pluralLowercaseTableName}: ' + numberOfDeletedItems;
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

// writeMutations ends here

var writeSchemaDefinition = function() {
  var schema = fs.readFileSync('./generated/type_definitions.js', 'utf-8');
  schema += fs.readFileSync('./generated/queries.js', 'utf-8');
  schema += fs.readFileSync('./generated/mutations.js', 'utf-8');

  schema += `exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});`

  fs.writeFileSync('./generated/schema.js', schema, 'utf-8');
}

exports.GraphqlGenerator = new GraphqlGenerator();