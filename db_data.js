var pg = require('pg');
var fs = require('fs');

var connection = new pg.Client({
  user: 'rachelminto',
  database: 'relay',
  password: 'postgres',
  host: 'localhost', 
  port: 5432, 
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 3000, // how long a client is allowed to remain idle
});

var DBData = function () {};
connection.connect();

DBData.prototype.readSchema = function (callback) {
  Promise.all([tableNamesQuery, dbNameQuery]).then(values => { 
    var dbName = values[1].rows[0].catalog_name
    var tables = values[0].rows

    var meta = {
      data: dbName,
      tables: {}
    }

    var tableInfoFunctions = functionsFor(tables);

    Promise.all(tableInfoFunctions).then(values => {
      values.forEach(function(result) {
        var results = result.rows
        var tableName = results[0].table_name

        var table = {
          name: tableName,
          description: "This is a table called " + tableName,
          fields: {}
        }

        for (result in results) {
          var columnName = results[result].column_name
          table.fields[columnName] = columnData(results[result]);
        }

        meta.tables[tableName] = table
      });

      writeToJSON(meta);

      callback(meta);
    });
  });  
};

var writeToJSON = function(meta) {
  fs.writeFile('schema.json', JSON.stringify(meta), 'utf8', function(result) {
    console.log("Wrote to json file.")
  });
}

var tableNamesQuery = connection.query(`SELECT * FROM information_schema.tables 
  WHERE table_schema = 'public'`)

function tableInfo(tableName) {
  return connection.query(`SELECT column_name, data_type, is_nullable, table_name, 
    column_default FROM information_schema.columns WHERE table_name = $1`, [tableName])
}

function functionsFor(tables) {
  var tableFunctions = []

    for (table in tables) {
      tableFunctions.push(tableInfo(tables[table].table_name));
    }

  return tableFunctions
}

var dbNameQuery = connection.query(`SELECT * FROM 
  information_schema.information_schema_catalog_name;`)

var columnData = function(field) {
  var data = {
    is_nullable: field.is_nullable,
    data_type: field.data_type,
    column_default: field.column_default
  }

  return data;
};

exports.DBData = new DBData();