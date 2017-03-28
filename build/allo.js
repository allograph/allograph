#!/usr/bin/env babel-node
const program = require('commander'); 
const dbTranslator = require('../index.js').DBTranslator;
const knex = require('../database/connection.js')
const migrationGenerator = require('../database/migration_generator.js').MigrationGenerator

program
  .version('0.0.1')
  .option('-n, --no_models', 'No models will be generated.')
  .option('-c, --create_table <tableName>', 'Sets up migration to create table')

program
  .command('server')
  .description('Start Allograph server')
  .action(function(req,optional){
    const graphQLServer = require('../server.js').GraphQLServer;
    graphQLServer.run()
  });

program
  .command('generate:graphql')
  .description('Inspect DB schema and generate GraphQL schema.js file')
  .action(function(){
    dbTranslator.generate();
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