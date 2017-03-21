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

connection.connect();

var DBData = function () {};

function queryAsync(query, arg=[]) {
  return new Promise(function(resolve,reject) {
    (connection.query(query, arg, function(err, data) {
      if (err !== null) return reject(err);
      resolve(data);
    }));
  });
}

DBData.prototype.readSchema = function (callback) {
  Promise.all([queryAsync(tableNamesQuery), queryAsync(dbNameQuery), queryAsync(relationQuery)]).then(values => {
    var dbName = values[1].rows[0].catalog_name;
    var tables = values[0].rows.map(function(row) {
                    return row.table_name;
                  });
    var relations = values[2].rows;
    var meta = {
      data: dbName,
      tables: {}
    };

    var tableInfoPromises = promisesFor(tables);

    Promise.all(tableInfoPromises).then(values => {
      values.forEach(function(result) {
        var results = result.rows;
        var tableName = results[0].table_name;

        var table = {
          name: tableName,
          description: "This is a table called " + tableName,
          fields: {}
        };

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
};

var tableNamesQuery = `SELECT * FROM information_schema.tables
  WHERE table_schema = 'public'`;

function tableInfo(tableName) {
  return queryAsync(`SELECT column_name, data_type, is_nullable, table_name,
    column_default FROM information_schema.columns WHERE table_name = $1::text`, [tableName]);
}

function promisesFor(tableNames) {
  var tablesPromises = []

    tableNames.forEach(function(tableName) {
      tablesPromises.push(tableInfo(tableName));
    });

  return tablesPromises;
}

var dbNameQuery = `SELECT * FROM
  information_schema.information_schema_catalog_name;`;

var columnData = function(field) {
  var data = {
    is_nullable: field.is_nullable,
    data_type: field.data_type,
    column_default: field.column_default
  }

  return data;
};

var relationQuery = `
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
`;

var writeRelation = function(meta, relations) {
  relations.forEach(function(relation) {
    meta.tables[relation["pk_table"]].fields[relation["fk_table"]] = {
      data_type: "list[" + formatTableName(relation["fk_table"]) + "]"
    }

    delete meta.tables[relation["fk_table"]].fields[relation["fk_column"]]
    meta.tables[relation["fk_table"]].fields[relation["pk_table"]] = {
      data_type: formatTableName(relation["pk_table"]),
      update_rule: relation["update_rule"],
      delete_rule: relation["delete_rule"]
    }
  });

  return meta;
};

var formatTableName = function(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

exports.DBData = new DBData();