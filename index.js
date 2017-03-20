const dbData = require('./db_data.js').DBData;
const schemaTranslator = require('./schema_translator.js').SchemaTranslator;

dbData.readSchema(schemaTranslator.printMetadata);