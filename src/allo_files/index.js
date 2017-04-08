const dbData = require('./database/data.js').DBData;
const graphqlGenerator = require('./schema/graphql_generator.js').GraphqlGenerator;
var DBTranslator = function () {};

DBTranslator.prototype.generate = function() {
  dbData.readSchema(graphqlGenerator.printMetadata);
}
// new DBTranslator().generate();
exports.DBTranslator = new DBTranslator();