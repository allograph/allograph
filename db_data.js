var pg = require('pg');
var fs = require('fs');
var knex = require('./db_connection')

var DBData = function () {};

DBData.prototype.readSchema = function (callback) {
  knex.raw("SELECT * FROM information_schema.tables WHERE table_schema = 'public'")
  .then(function(result) {
    var dbName = result.rows[0].table_catalog;
    var tables = result.rows.map(function(row) {
                    return row.table_name;
                  });  

    var meta = {
      data: dbName,
      tables: {}
    };  

    var promisesFor = function(tables) {
      var promises = []
      tables.forEach(function(tableName) {
        promises.push(knex.raw(`SELECT column_name, data_type, is_nullable, table_name,
      column_default FROM information_schema.columns WHERE table_name = ?::text`, [tableName]))
      });

      promises.push(relationQuery)
      return promises;
    }

    Promise.all(promisesFor(tables)).then(values => {
      var relations_results = values.pop();
      var relations = relations_results.rows;

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

      var metaWithRelations = writeRelation(meta, relations);
      writeToJSON(metaWithRelations);

      callback(meta);    
    })
  });
}

var columnData = function(field) {
  var data = {
    is_nullable: field.is_nullable,
    data_type: field.data_type,
    column_default: field.column_default
  }

  return data;
};

var writeToJSON = function(meta) {
  fs.writeFile('schema.json', JSON.stringify(meta), 'utf8', function(result) {
  });
};

var relationQuery = knex.raw(`
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
      data_type: "list[" + formatTableName(relation["fk_table"]) + "]",
      fk_column: relation["fk_column"],
      pk_column: relation["pk_column"]
    }

    delete meta.tables[relation["fk_table"]].fields[relation["fk_column"]]
    meta.tables[relation["fk_table"]].fields[relation["pk_table"]] = {
      data_type: formatTableName(relation["pk_table"]),
      update_rule: relation["update_rule"],
      delete_rule: relation["delete_rule"],
      fk_column: relation["fk_column"],
      pk_column: relation["pk_column"],
      pk_datatype: meta.tables[relation["pk_table"]]
                       .fields[relation["pk_column"]]["data_type"]
    }
  });

  return meta;
};

var formatTableName = function(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

exports.DBData = new DBData();