var knex = require('../../database/connection');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('full_name').notNullable().unique();
    table.string('email').notNullable().unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};