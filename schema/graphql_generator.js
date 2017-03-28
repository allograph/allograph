var fs = require('fs'),
    lingo = require('lingo'),
    inputQueryDoc = fs.readFileSync('./schema/query.graphql', 'utf-8'),
    inputMutationDoc = fs.readFileSync('./schema/mutation.graphql', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),
    { buildSchema, printSchema, print, parse } = require('graphql');

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  var typeDoc = getGraphQLTypeDoc(dbMetadata),
      queryDoc = getGraphQLQueryDoc(dbMetadata),
      mutationDoc = getGrpahQLMutationDoc(dbMetadata);

  writeToGraphQLSchema(typeDoc, queryDoc, mutationDoc);
  writeGraphQLSchemaExport();
}

var writeToFile = function(data, fileName) {
  fs.writeFileSync('./schema/' + fileName, data, 'utf-8');
}

var getGraphQLTypeDoc = function(dbMetadata) {
  var typeDoc = '';

  for (var table in dbMetadata.tables) {
    var objTypeName = h.singularCapitalizedTableName(table);
    var description = dbMetadata.tables[table].description;
    typeDoc += h.toComment(description) + h.toGraphQLObj(objTypeName);

    for (var column in dbMetadata.tables[table].fields) {
      var dataType = dbMetadata.tables[table].fields[column].data_type;
      var isNullable = dbMetadata.tables[table].fields[column].is_nullable;
      typeDoc += h.toGraphQLField(column, dataType, isNullable);
    }

    typeDoc += `}\n\n`
  }
  return typeDoc;
}

var getGraphQLQueryDoc = function(dbMetadata) {
  var inputQueryDefs = [],
      queryDoc = h.toComment('Root query object') + h.toGraphQLObj('Query'),
      queryAST = parse(inputQueryDoc),
      queryFields = queryAST.definitions[0].fields;

  queryFields.forEach(function(field) {
    inputQueryDefs.push(field.name.value);
    queryDoc += `  ` + print(field) + `\n`;
  });
  queryDoc = queryDoc.slice(0, -1);

  for (var table in dbMetadata.tables) {
    var columns = dbMetadata.tables[table].fields;

    if (inputQueryDefs.indexOf(table) === -1) {
      queryDoc += h.toQueryField(columns, table);
    }
  }
  queryDoc += `\n}\n`
  return queryDoc;
}

var getGrpahQLMutationDoc = function(dbMetadata) {
  var inputMutationDefs = [],
      mutationDoc = h.toComment('Functions to set stuff') + h.toGraphQLObj('Mutation'),
      mutationAST = parse(inputMutationDoc),
      mutationFields = mutationAST.definitions[0].fields,
      actions = ['add', 'update', 'delete'];

  mutationFields.forEach(function(field) {
    inputMutationDefs.push(field.name.value);
    mutationDoc += `  ` + print(field) + `\n`;
  });
  mutationDoc = mutationDoc.slice(0, -1);

  for (var table in dbMetadata.tables) {
    var objTypeName = h.singularCapitalizedTableName(table);
    var columns = dbMetadata.tables[table].fields;

    actions.forEach(function(action) {
      var mutationDef = action + objTypeName;

      if (inputMutationDefs.indexOf(mutationDef) === -1) {
        mutationDoc += h.toMutationField(action, columns, objTypeName);
      }
    });
  }
  mutationDoc += `\n}\n`
  return mutationDoc;
}

var writeToGraphQLSchema = function(typeDoc, queryDoc, mutationDoc) {
  var concatSchema = `schema {
  query: Query
  mutation: Mutation
}\n\n` + typeDoc + `\n` + queryDoc + `\n` + mutationDoc;

  writeToFile(concatSchema, 'schema.graphql');
}

var writeGraphQLSchemaExport = function() {
  var data = `var { buildSchema } = require('graphql'),
    fs = require('fs'),
    schema = fs.readFileSync('./schema/schema.graphql', 'utf-8');

exports.Schema = buildSchema(schema);`

  writeToFile(data, 'schema.js');
}

exports.Schema =
exports.GraphqlGenerator = new GraphqlGenerator();