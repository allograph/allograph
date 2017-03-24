#!/usr/bin/env babel-node
const program = require('commander');
const graphQLServer = require('../server.js').GraphQLServer;
const dbTranslator = require('../index.js').DBTranslator;
const knex = require('../database/connection.js')

program
  .version('0.0.1')
  .command('server')
  .description('Start Allograph server')
  .action(function(req,optional){
    graphQLServer.run()
  });

program
  .version('0.0.1')
  .command('generate:graphql')
  .description('Inspect DB schema and generate GraphQL schema.js file')
  .action(function(req,optional){
    dbTranslator.translate();
  });

program
  .version('0.0.1')
  .command('migrate')
  .description("Runs all migrations that have not yet been run.")
  .action(function(req,optional){
    knex.migrate.latest({directory: "./migrations"});
  });

program
  .version('0.0.1')
  .command('migrate:rollback')
  .description("Rolls back the latest migration group.")
  .action(function(req,optional){
    knex.migrate.rollback({directory: "./migrations"});
  });

program
  .version('0.0.1')
  .command('create:model')
  .description("Creates Bookshelf model. Note: does not automatically create a table in db.")
  .action(function(req,optional){
    knex.migrate.rollback({directory: "./migrations"});
  });  

program
  .version('0.0.1')
  .command('create:migration')
  .description("Creates migration file. Can be modified by supplying options.")
  .action(function(req,optional){
    knex.migrate.make(name, [config]);
  });  

program.parse(process.argv);   


// Terminal Commands

// **Setup**
// "allo generate:graphql"
//     description: Generates GraphQL Schema from Database
//     options: w/ bookshelf model creation for each table

// "allo server"
//     description: Starts server

// "allo routes"
//     description: Returns a list of all routes

// **Migrations**
// "allo migrate"
//     options: -gql update GraphQL schema
//     description: Runs all migrations that have not yet been run.

// "allo migrate:rollback"
//     description: Rolls back the latest migration group. Automatically updates graphQL schema and Bookshelf models.

// ---

// **Models and Tables**

// Q: Should we do model:create or create:model or a different format?

// "allo create:model <modelName>"
//     description: Creates Bookshelf model. Does not automatically create a table in db. Is this useful?
//     options: 
//         -ho <otherTable> (has one relationship to other table)
//         -hm <otherTable> (has many relationship to other table)

// "allo create:migration <tableName> [(columnName):(columnType):([constraints])]"
//     description: Creates table migration to create table. Must run "allo migrate" to persist change to db and to automatically generate model (if -m option given).
//     options: 
//         -m Will create model upon migration
//         -ho <otherTable> (has one relationship to other table)
//         -hm <otherTable> (has many relationship to other table)   


// "allo db:seed" to seed data.

// 15 min:

// "allo drop:table <tableName>"
//     description: Creates table migration to drop table. Must run "allo migrate" to persist change to db.

// "allo rename:column <tableName> <oldColumnName> <newColumnName>"
//     options: 
//     description: Creates table migration to update table. Must run "allo migrate" to persist change to db.   

// "allo change:column_type <tableName> <columnName>" 
//     options: -i, -s, -d (integer, string, datetime)

// "allo add:constraint <tableName> <columnName>"
//     options: -nn, -d (nonNull, distinct)  *must pick at least one option*
//     description: Creates table migration to update table. Must run "allo migrate" to persist change to db.

// "allo remove:constraint <tableName> <columnName>"
//     options: -nn, -d (nonNull, distinct)  *must pick at least one option*
//     description: Creates table migration to update table. Must run "allo migrate" to persist change to db.    