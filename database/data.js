var pg = require('pg');
var fs = require('fs');
var lingo = require('lingo');

var knex = require('./connection')

var DBData = function () {};

DBData.prototype.readSchema = function (callback, skipModelCreation) {
  knex.raw("SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND NOT (table_name = 'knex_migrations' OR table_name = 'knex_migrations_lock')")
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
        promises.push(knex.raw(`SELECT column_name, data_type, is_nullable::boolean, table_name,
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
          fields: {},
          relations: { has_many: [], has_one: []}
        };

        for (result in results) {
          var columnName = results[result].column_name
          table.fields[columnName] = columnData(results[result]);
        }

        meta.tables[tableName] = table
      });

      var metaWithRelations = writeRelation(meta, relations);
      writeToJSON(metaWithRelations);


      callback(meta, skipModelCreation);
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
  fs.writeFileSync('./generated/schema.json', JSON.stringify(meta), 'utf8', function(result) {
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
  var relationTables = relations.map(function(relation) {
    return relation.fk_table;
  })

  relations.forEach(function(relation) {
    // has_many has_one relationships
    if (isJunctionTable(relation.fk_table, relationTables, meta)) {
      var pkTableNames = pkTablesRefByJunction(relation.fk_table, relation.pk_table, relations)

      for (var pkTable of pkTableNames) {
        meta.tables[pkTable].relations.has_many.push(relation.pk_table)
      }

      meta.tables[relation.fk_table].relations.has_one.push(relation.pk_table)
      meta.tables[relation.pk_table].relations.has_many.push(relation.fk_table)
    } else {
      meta.tables[relation.pk_table].relations.has_many.push(relation.fk_table)
      meta.tables[relation.fk_table].relations.has_one.push(relation.pk_table)
    }

    // property in primary table
    meta.tables[relation["pk_table"]].fields[relation["fk_table"]] = {
      data_type: "[" + singularCapitalizedTableName(relation["fk_table"]) + "]",
      fk_column: relation["fk_column"],
      pk_column: relation["pk_column"],
      is_nullable: true
    }

    // property in foriegn table
    var fk_data = Object.assign({}, meta.tables[relation["fk_table"]].fields[relation["fk_column"]]);

    meta.tables[relation["fk_table"]].fields[relation["pk_table"]] = {
      data_type: singularCapitalizedTableName(relation["pk_table"]),
      update_rule: relation["update_rule"],
      delete_rule: relation["delete_rule"],
      fk_column: relation["fk_column"],
      pk_table: relation["pk_table"],
      pk_column: relation["pk_column"],
      fk_datatype: fk_data.data_type,
      is_nullable: fk_data.is_nullable
    }
  });

  return meta;
};

var pkTablesRefByJunction = function(tableName, pkTable, relations) {
  var relationTables = relations.filter(function(relation) {
    return relation.fk_table == tableName && relation.pk_table != pkTable
  })

  var relationTableNames = relationTables.map(function(relationTable) {
    return relationTable.pk_table
  })

  return relationTableNames
}

var isJunctionTable = function(tableName, tableNames, meta) {
  if (Object.keys(meta.tables[tableName].fields).length != 3) {
    return false;
  }

  var count = 0;

  for(var i = 0; i < tableNames.length; ++i){
    if(tableNames[i] == tableName) {
      count++;
    }
  }

  return !!(count > 1)
}

var singularCapitalizedTableName = function(name) {
  var singularName = lingo.en.singularize(name)
  return lingo.capitalize(singularName);
}

exports.DBData = new DBData();