var knex = require('../database/connection');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('todos', function(table) {
    table.increments('id').primary();
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todos')
};