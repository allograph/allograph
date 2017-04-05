var fs = require('fs'),
    lingo = require('lingo'),
    inputCustomMutations = fs.readFileSync('./schema/mutations.js', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),
    query = require('./queries.js').Query,
    mutation = require('./mutations.js').Mutation,
    swaggerQuery = require('../swagger').queryFields('./swagger/swagger.json'),
    swaggerMutation = require('../swagger').mutationFields('./swagger/swagger.json');

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  writeGraphQLSuperModels(dbMetadata);
  writeModelFiles(dbMetadata);
  writeTypesFile(dbMetadata);
  writeMutationsFile(dbMetadata);

  writeQueriesFile(dbMetadata);
  writeSchemaDefinition(dbMetadata);
  process.exit()
}

// Starts here for model file generation

var writeModelFiles = function(dbMetadata) {
  for (var property in dbMetadata.tables) {
    var singularLowercaseTableName = lingo.en.singularize(property).toLowerCase();
    var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName)

    var data = `import { Base${singularCapitalizedTableName} } from '../../generated/models'
var knex = require('../../database/connection');\n
export class ${singularCapitalizedTableName} extends Base${singularCapitalizedTableName} {\n\n}`;

    var pathName = `./schema/models/${singularLowercaseTableName}.js`
    if (fs.existsSync(pathName)) {
      console.log('Model file already exists and will not be overwritten.')
    } else {
      fs.writeFileSync(pathName, data, { flag: 'wx' }, function (err) {
        if (err) {
          console.log('file already exists.')
        } else {
          console.log('created file.')
        }
      });
    }
  }
}

// Ends model file generation

// Starts here for super model generation

var writeGraphQLSuperModels = function(dbMetadata) {
  var data = `// This file is generated by Allograph. We recommend that you do not modify this file.
var knex = require('../database/connection');`

  for (var property in dbMetadata.tables) {
    if (dbMetadata.tables.hasOwnProperty(property)) {
      data += modelData(dbMetadata.tables[property]);
    }
  }

  fs.writeFileSync('./generated/models.js', data, 'utf-8');
}

var modelData = function(tableInfo) {
  var tableName = tableInfo.name
  var pluralTableName = lingo.en.pluralize(lingo.en.singularize(tableName))
  var singularTableName = lingo.en.singularize(tableName)
  var singularCapitalizedTableName = lingo.capitalize(singularTableName)
  var validArgs = toArgs(tableInfo.fields);

  var data = `\n\nexport class Base${singularCapitalizedTableName} {
  ${pluralTableName}(args) {
    return knex('${tableName}').where(args);
  }

  create${singularCapitalizedTableName}(args) {
    return knex.returning('id').insert({`

  data += validArgs

  data += `\n    }).into('${tableName}').then(id => {
      return knex('${tableName}').where({ id: id[0] }).first();
    });
  }

  update${singularCapitalizedTableName}(args) {
    return knex('${tableName}').where({ id: args.id }).returning('id').update({`

  data += validArgs

  data += `\n    }).then(id => {
      return knex('${tableName}').where({ id: id[0] }).first();
    });
  }

  delete${singularCapitalizedTableName}(args) {
    return knex('${tableName}').where({ id: args.id }).del()
  }
}`

return data;
}

var toArgs = function(fields) {
  var args = '';
  for (var field in fields) {
    var type = fields[field].data_type;

    if (field != 'id') {
      if (validArgsType(type)) {
        args += `\n      ${field}: args.${field},`;
      }
    }
  }

  return args;
}

var validArgsType = function(type) {
  var typeMap = {
          'character varying': 'String',
          'integer': 'Int',
          'text': 'String',
          'boolean': 'Boolean',
          'timestamp with time zone': 'String'
        };

  return typeMap[type]
}

// Super Model generation ends

// Translating to GraphQL Type starts here
var graphQLData = function() {
  return `import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');`
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
  var lowercaseTableName = tableName.toLowerCase(),
      listType = psqlType.match(/\[(\w+)\]/),
      args,
      returnValue = `;`,
      fieldName = column;

  if (listType) {
    args = `{ ${fk_column}: ${lowercaseTableName}.${pk_column} }`
  } else {
    args = `{ ${pk_column}: ${lowercaseTableName}.${fk_column} }`
    returnValue = `.first();`
    fieldName = lingo.en.singularize(column);
  }

  return '\n      ' + fieldName + `: {
        type: ` + psqlTypeToGraphQLType(psqlType) + `,
        resolve (` + lowercaseTableName + `, args, context) {
          return knex('${column}').where(` + args + `)` + returnValue + `
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
`\n        resolve (` + lingo.en.singularize(table) + `, args, context) {
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
  fs.writeFileSync('./generated/schema.js', data, 'utf-8');
  addTypeDefinitionExportStatement(dbMetadata);
}

var addTypeDefinitionExportStatement = function(dbMetadata) {
  var schema = fs.readFileSync('./generated/schema.js', 'utf-8')
  var exportStatement = `\n\nexport {`

  for (var tableName in dbMetadata.tables) {
    var singularLowercaseTableName = lingo.en.singularize(tableName);
    var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName)
    exportStatement += ` ${singularCapitalizedTableName},`
  }

  exportStatement = exportStatement.slice(0, -1);
  schema = schema + exportStatement + " }"

  fs.writeFileSync('./generated/type_definitions.js', schema, 'utf-8');
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
      var listType = (customQueries[customQuery].type)

    if(listType.toString().match(/\[(\w+)\]/)) {
      var baseGraphQLObjectType = listType.toString().replace(/[\[\]]/g, "")
      newData += `\n      ${customQuery}: {
          type: new GraphQLList(${baseGraphQLObjectType}),
          args: {`
    } else {
      newData += `\n      ${customQuery}: {
          type: ${h.toGraphQLTypeFromJSType(customQueries[customQuery].type)},
          args: {`
    }

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
    var pluralTableName = lingo.en.pluralize(lingo.en.singularize(property.toLowerCase())) // Account for both singular and plural table names.

    if (Object.keys(customQueries).includes(pluralTableName)) { continue; }

    newData += queryTableHeader(tableName)

    for (var column in dbMetadata.tables[property].fields) {
      var psqlType = dbMetadata.tables[property].fields[column].data_type;
      var typeMap = {
            'character varying': 'GraphQLString',
            'integer': 'GraphQLInt',
            'boolean': 'GraphQLBoolean',
            'text': 'GraphQLString',
            'timestamp with time zone': 'GraphQLString'
          };

      if (typeMap[psqlType]) {
        newData += queryTableArgs(column, psqlType);
      }
    }

    newData = newData.slice(0, -1);
    newData += queryResolveFunction(tableName)
  }
console.log("OUTSIDE")
console.log(swaggerQuery)
  swaggerQuery.then(queries => {
    console.log("HERE")
    console.log(queries);
    for (var query in queries) {
      console.log(queries[query])
    }
  }, error => {
    console.log("ERROR")
    console.log(error);
  });

  newData += queryClosingBrackets();
  newData += '\n\n'
  fs.writeFileSync('./generated/queries.js', newData, 'utf-8')
}

var getSwaggerQuery = function() {
  var data = ''

  swaggerQuery.then(queries => {
    // console.log(queries);
    for (var query in queries) {
      data += query + `: {
  type: ` + queries[query].type.toString() + `,
  args: {
    `;
      for (var arg in queries[query].args) {
        data += arg + `: {
      type: `
      console.log(queries[query].args[arg].type);
      }

//   `resolve ` + queries[query].resolve.toString() + `
// },` + '\n'

//       console.log(queries[query].args)
      // console.log(queries[query].resolve.toString())
    }
    // console.log(data)
  });
}

// getSwaggerQuery()

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
        'integer': 'GraphQLInt',
        'boolean': 'GraphQLBoolean',
        'text': 'GraphQLString',
        'timestamp with time zone': 'GraphQLString'
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
  var lowercaseTableName = tableName.toLowerCase();
  var pluralizedLowercaseTableName = lingo.en.pluralize(lowercaseTableName)
  return `
        },
        resolve (root, args, context) {
          var ${lowercaseTableName} = new ${tableName}Class()
          return ${lowercaseTableName}.${pluralizedLowercaseTableName}(args);
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
  var customMutations = mutation.fields();

  for (var customMutation in customMutations) {
    if (Object.keys(customMutations[customMutation]).length === 0) { continue; }

    newData += `\n      ${customMutation}: {
        type: ${h.toGraphQLTypeFromJSType(customMutations[customMutation].type)},
        args: {`

    for (var arg in customMutations[customMutation].args) {
      newData += `\n          ${arg}: {
            type: ${h.toGraphQLTypeFromJSType(customMutations[customMutation].args[arg].type)}\n          },`
    }

    newData += `\n        },\n        `
    newData += customMutations[customMutation].resolve.toString()
    newData += `\n      },`
  }

  // if there is table called 'users', add default login mutation
  if (Object.keys(dbMetadata.tables).includes("users") &&
    Object.keys(dbMetadata.tables["users"].fields).includes("email") &&
    Object.keys(dbMetadata.tables["users"].fields).includes("password")) {
    newData += mutationLogin(dbMetadata.tables["users"]);
  } else {
    console.log("You don't have a table 'users' with columns 'password' and 'email',")
    console.log("so there won't be an auto generated default login mutation.")
  }


  for (var property in dbMetadata.tables) {
    if (dbMetadata.tables.hasOwnProperty(property)) {
      if (!Object.keys(customMutations).includes("add" + h.singularCapitalizedTableName(property))) {
        newData += mutationAdd(property, dbMetadata.tables[property]);
      }

      if (!Object.keys(customMutations).includes("update" + h.singularCapitalizedTableName(property))) {
      newData += mutationUpdate(property, dbMetadata.tables[property]);
      }
      if (!Object.keys(customMutations).includes("delete" + h.singularCapitalizedTableName(property))) {
      newData += mutationDelete(property, dbMetadata.tables[property]);
      }
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

var mutationLogin = function(tableData) {
  var newData = `\n      login: {
        type: GraphQLString,
        args: {`;

  for (var column in tableData.fields) {
    var psqlType = tableData.fields[column].data_type;

    if (validLoginType(psqlType) && (column === 'email' || column === 'password')) {
      var graphQLType = psqlTypeToGraphQLType(psqlType);
      newData += `\n          ${column}: {
            type: new GraphQLNonNull(${graphQLType})
          },`;
    }
  }

  newData = newData.slice(0, -1);
  newData += `
        },
        resolve (root, args, context) {
          var user = new UserClass();
          return user.users(args).then(user => {
            return jwt.sign({ user: user[0] }, 'allograph-secret' );
          });
        }
      },`
  return newData
}

var validLoginType = function(psqlType) {
  var typeMap = {
        'character varying': 'GraphQLString',
        'integer': 'GraphQLInt',
        'text': 'GraphQLString'
      };
  return !!typeMap[psqlType];
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
  newData += `
        },
        resolve (root, args, context) {
          var ${singularLowercaseTableName} = new ${singularCapitalizedTableName}Class()
          return ${singularLowercaseTableName}.create${singularCapitalizedTableName}(args);
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
        resolve (root, args, context) {
          var ${singularLowercaseTableName} = new ${singularCapitalizedTableName}Class()
          return ${singularLowercaseTableName}.update${singularCapitalizedTableName}(args);
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
        resolve (root, args, context) {
          var ${singularLowercaseTableName} = new ${singularCapitalizedTableName}Class()
          return ${singularLowercaseTableName}.delete${singularCapitalizedTableName}(args);
        }
      },`

  return newData
}

var validForMutation = function(psqlType) {
  var typeMap = {
        'character varying': 'GraphQLString',
        'integer': 'GraphQLInt',
        'boolean': 'GraphQLBoolean',
        'text': 'GraphQLString',
        'timestamp with time zone': 'GraphQLString'
      };
  return !!typeMap[psqlType];
}

// writeMutations ends here

var importModels = function(dbMetadata) {
  var importStatement = '// This file is generated by Allograph. We recommend that you do not modify its contents.\n\n'

  for (var tableName in dbMetadata.tables) {
    var singularLowercaseTableName = lingo.en.singularize(tableName);
    var singularCapitalizedTableName = lingo.capitalize(singularLowercaseTableName)
    importStatement += `import { ${singularCapitalizedTableName} as ${singularCapitalizedTableName}Class } from '../schema/models/${singularLowercaseTableName}'\n`
  }

  return importStatement
}

var writeSchemaDefinition = function(dbMetadata) {
  var schema = importModels(dbMetadata);
  // Type definitions already written to schema file b/c needed to add export
  // statement to type definition file before generating queries & mutations
  schema += fs.readFileSync('./generated/schema.js', 'utf-8');
  schema += fs.readFileSync('./generated/queries.js', 'utf-8');
  schema += fs.readFileSync('./generated/mutations.js', 'utf-8');

  schema += '\n\n' + `exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});`

  fs.writeFileSync('./generated/schema.js', schema, 'utf-8');
}

exports.GraphqlGenerator = new GraphqlGenerator();