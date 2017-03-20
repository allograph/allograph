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

      writeRelation(meta, relations);
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

var relationQuery = connection.query(`
SELECT
  fk.table_name AS FK_Table,
  cu.column_name AS FK_Column,
  fk.constraint_type AS fk_constraint_type,
  pk.table_name AS PK_Table,
  pt.column_name AS PK_Column,
  pk.constraint_type AS pk_constraint_type,
  c.constraint_name,
  c.update_rule,
  c.delete_rule
FROM
  information_schema.referential_constraints AS c
INNER JOIN
  information_schema.table_constraints AS fk
  ON c.constraint_name = fk.constraint_name
INNER JOIN
  information_schema.table_constraints AS pk
  ON c.unique_constraint_name = pk.constraint_name
INNER JOIN
  information_schema.key_column_usage AS cu
  ON c.constraint_name = cu.constraint_name
INNER JOIN
  (
    SELECT
      i1.table_name,
      i2.column_name
    FROM
      information_schema.table_constraints AS i1
    INNER JOIN
      information_schema.key_column_usage AS i2
    ON
      i1.constraint_name = i2.constraint_name
    WHERE i1.constraint_type = 'PRIMARY KEY'
  ) AS pt
  ON
    pt.table_name = pk.table_name
`);

var writeRelation = function(meta, relations) {
  relations.forEach(function(relation) {
    meta.tables[relation["pk_table"]].fields[relation["fk_table"]] = {
      data_type: "list"
    }

    delete meta.tables[relation["fk_table"]].fields[relation["fk_column"]]
    meta.tables[relation["fk_table"]].fields[relation["pk_table"]] = {
      data_type: "object",
      update_rule: relation["update_rule"],
      delete_rule: relation["delete_rule"]
    }
  });

  return meta;
};

exports.DBData = new DBData();