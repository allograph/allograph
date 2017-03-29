var fs = require('fs'),
    lingo = require('lingo'),
    inputCustomQueries = fs.readFileSync('./schema/queries.js', 'utf-8'),
    inputCustomMutations = fs.readFileSync('./schema/mutations.js', 'utf-8'),
    GraphqlGenerator = function () {},
    h = require('./helper.js'),

GraphqlGenerator.prototype.printMetadata = function(dbMetadata) {
  // writeGraphQLClassModels(dbMetadata);
  // writeMutationsFile(dbMetadata);
  // writeQueriesFile(dbMetadata);
  // writeTypesFile(dbMetadata);
  // writeSchemaDefinition();
}

exports.GraphqlGenerator = new GraphqlGenerator();