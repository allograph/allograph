#!/usr/bin/env babel-node
var fs = require('fs-extra');
var pathname = process.cwd()
const program = require('commander'); 
const dbTranslator = require(pathname + '/index.js').DBTranslator;
const knex = require(pathname + '/database/connection.js')
const migrationGenerator = require(pathname + '/database/migration_generator.js').MigrationGenerator

program
  .version('0.0.1')
  .option('-n, --no_models', 'No models will be generated.')
  .option('-c, --create_table <tableName>', 'Sets up migration to create table')

program
  .command('server')
  .description('Start Allograph server')
  .action(function(req,optional){
    const graphQLServer = require(pathname + '/server.js').GraphQLServer;
    graphQLServer.run()
  });

program
  .command('schema')
  .description('Inspect DB schema and generate GraphQL schema.js file')
  .action(function(){
    dbTranslator.generate();
  });

program
  .command('migrate')
  .description("Runs all migrations that have not yet been run.")
  .action(function(req,optional){
    knex.migrate.latest({directory: pathname + "/migrations"});
  });

program
  .command('migrate:rollback')
  .description("Rolls back the latest migration group.")
  .action(function(req,optional){
    knex.migrate.rollback({directory: pathname + "/migrations"});
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