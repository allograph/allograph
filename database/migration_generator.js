var knex = require('./connection');
var fs = require('fs');

var MigrationGenerator = function () {};

MigrationGenerator.prototype.generic = function(name) {
  var data = requireStatement();

  data += `\n\nexports.up = function(knex, Promise) {
};

exports.down = function(knex, Promise) {
};`

  fs.writeFileSync(fileName(name), data, 'utf-8');
}

MigrationGenerator.prototype.createTable = function(name, tableName) {
  var data = requireStatement();

  data += `\n\nexports.up = function(knex, Promise) {
  return knex.schema.createTable('${tableName}', function(table) {
    table.increments('id').primary();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('${tableName}')
};`
  
  fs.writeFileSync(fileName(name), data, 'utf-8');
}

var requireStatement = function() {
  return "var knex = require('../database/connection');"
}

var fileName = function(name) {
  return './migrations/' + Date.now() + '_' + name + '.js';
}


exports.MigrationGenerator = new MigrationGenerator();