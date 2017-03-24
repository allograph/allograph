const dbData = require('./database/data.js').DBData;
const schemaTranslator = require('./schema/schema_translator.js').SchemaTranslator;
var DBTranslator = function () {};

DBTranslator.prototype.translate = function() {
  dbData.readSchema(schemaTranslator.printMetadata);
}

exports.DBTranslator = new DBTranslator();