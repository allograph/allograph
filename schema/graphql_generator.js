var fs = require('fs');
var lingo = require('lingo');
var GraphqlGenerator = function () {};
var h = require('./helper.js')
var Bookshelf = require('../bookshelf/bookshelf.js').Bookshelf
var { buildSchema, typeFromAST, parse } = require('graphql');

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  writeGraphQLObjectSchema(dbMetadata);
  writeGraphQLQuerySchema(dbMetadata);
  writeGrpahQLMutationSchema(dbMetadata);

  writeGraphQLSchemaExport();
  writeTypeBasedModel();
}

var writeToFile = function(data, fileName) {
  fs.writeFileSync('./schema/' + fileName, data, 'utf-8');
}

var writeGraphQLObjectSchema = function(dbMetadata) {
  var newData = ''

  for (var table in dbMetadata.tables) {
    var objTypeName = h.singularCapitalizedTableName(table);
    var description = dbMetadata.tables[table].description;
    newData += h.toComment(description) + h.toGraphQLObj(objTypeName);

    for (var column in dbMetadata.tables[table].fields) {
      var dataType = dbMetadata.tables[table].fields[column].data_type;
      var isNullable = dbMetadata.tables[table].fields[column].is_nullable;
      newData += h.toGraphQLField(column, dataType, isNullable);
    }

    newData += `}\n\n`
  }
  writeToFile(newData, 'graphql/type.graphql');
}

var writeGraphQLQuerySchema = function(dbMetadata) {
  var newData = h.toComment('Root query object') + h.toGraphQLObj('Query');
  newData = newData.slice(0, -1);

  for (var table in dbMetadata.tables) {
    var columns = dbMetadata.tables[table].fields;
    newData += h.toQueryEntry(columns, table);
  }
  newData += `\n}`
  writeToFile(newData, 'graphql/query.graphql');
}

var writeGrpahQLMutationSchema = function(dbMetadata) {
  var newData = h.toComment('Functions to set stuff') + h.toGraphQLObj('Mutation');
  var actions = ['add', 'update', 'delete']
  newData = newData.slice(0, -1);

  for (var table in dbMetadata.tables) {
    var objTypeName = h.singularCapitalizedTableName(table);
    var columns = dbMetadata.tables[table].fields;
    actions.forEach(function(action) {
      newData += h.toMutation(action, columns, objTypeName);
    });
  }
  newData += `\n}`
  writeToFile(newData, 'graphql/mutation.graphql');
}

var writeGraphQLSchemaExport = function() {
  var data = `var { buildSchema } = require('graphql'),
    fs = require('fs'),
    typeSchema = fs.readFileSync('./schema/graphql/type.graphql', 'utf-8'),
    querySchema = fs.readFileSync('./schema/graphql/query.graphql', 'utf-8'),
    mutationSchema = fs.readFileSync('./schema/graphql/mutation.graphql', 'utf-8');\n
var concatSchema = \`schema {
  query: Query
  mutation: Mutation
}\` + typeSchema + \`\\n\` + querySchema + \`\\n\` + mutationSchema

exports.Schema = buildSchema(concatSchema);`

  writeToFile(data, 'js/schema.js');
}

var writeTypeBasedModel = function() {
  var typeSchema = fs.readFileSync('./schema/graphql/type.graphql', 'utf-8'),
      querySchema = fs.readFileSync('./schema/graphql/query.graphql', 'utf-8'),
      mutationSchema = fs.readFileSync('./schema/graphql/mutation.graphql', 'utf-8'),
      typeDefs = parse(typeSchema).definitions,
      queryDefs = parse(querySchema).definitions,
      mutationDefs = parse(mutationSchema).definitions;

  typeDefs.forEach(function(typeDef) {
    var objTypeName = h.singularCapitalizedTableName(typeDef.name.value),
        jsData = `class ` + objTypeName + ` {\n`;
console.log(objTypeName);
  });
  queryResolver();
  // for (var typeDef in typeDefs) {

    // var objTypeName = h.singularCapitalizedTableName(table);
    // var jsData = `class ` + objTypeName + ` {\n`

    // writeToFile(data, 'js/' + table + '.js');
  // }
}

var queryResolver = function() {
  var querySchema = fs.readFileSync('./schema/graphql/query.graphql', 'utf-8'),
      queryFields = parse(querySchema).definitions[0].fields,
      jsData = `\n  `,
      schema = require('./js/schema.js').Schema;

   queryFields.forEach(function(queryField) {
    var returnType = queryField.type;
console.log(typeFromAST(schema, returnType));
//     jsData += queryField.name.value + `(args) {
// return knex('$()').where(args).then(`
   });
}

// cannot be sure about which table and column
// validation? convention?

exports.GraphqlGenerator = new GraphqlGenerator();