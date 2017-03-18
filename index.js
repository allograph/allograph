const dbData = require('./db_data.js').DBData;

function printMetadata(metadata) {
  console.log(metadata)
}

dbData.readSchema(printMetadata);