const dbData = require('./database/data.js').DBData;
const schemaTranslator = require('./schema/schema_translator.js').SchemaTranslator;
var DBTranslator = function () {};

DBTranslator.prototype.translate = function(skipModelCreation) {
  dbData.readSchema(schemaTranslator.printMetadata, skipModelCreation);
}

exports.DBTranslator = new DBTranslator();