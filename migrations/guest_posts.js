var knex = require('../database/connection')

exports.up = function(knex, Promise) {
  return knex.schema.createTable('guests', function(table) {
    table.increments('id').primary();
    table.string('username');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('guests')
};