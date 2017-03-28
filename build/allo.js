#!/usr/bin/env babel-node
const program = require('commander');
const graphQLServer = require('../server.js').GraphQLServer;
const dbTranslator = require('../index.js').DBTranslator;
const knex = require('../database/connection.js')
const migrationGenerator = require('../database/migration_generator.js').MigrationGenerator
const bookshelf = require('../bookshelf/bookshelf.js').Bookshelf

program
  .version('0.0.1')
  .option('-n, --no_models', 'No models will be generated.')
  .option('-c, --create_table <tableName>', 'Sets up migration to create table')

program
  .command('server')
  .description('Start Allograph server')
  .action(function(req,optional){
    graphQLServer.run()
  });

program
  .command('generate:graphql')
  .description('Inspect DB schema and generate GraphQL schema.js file')
  .action(function(){
    var skipModelCreation = (program.no_models === true)
    dbTranslator.translate(skipModelCreation);
  });

program
  .command('migrate')
  .description("Runs all migrations that have not yet been run.")
  .action(function(req,optional){
    knex.migrate.latest({directory: "./migrations"});
  });

program
  .command('migrate:rollback')
  .description("Rolls back the latest migration group.")
  .action(function(req,optional){
    knex.migrate.rollback({directory: "./migrations"});
  });

// program
//   .command('create:model <modelName>')
//   .description("Creates Bookshelf model. Note: does not automatically create a table in db.")
//   .action(function(modelName){
//     bookshelf.createModel(modelName)
//   });  

program
  .command('create:migration <name>')
  .description("Creates migration file.")
  .action(function(name){
    if (program.create_table) {
      migrationGenerator.createTable(name, program.create_table)
    } else {
      migrationGenerator.generic(name)
    }
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