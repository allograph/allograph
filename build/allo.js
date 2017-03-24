#!/usr/bin/env babel-node
const program = require('commander');
const graphQLServer = require('../server.js').GraphQLServer;
const dbTranslator = require('../index.js').DBTranslator;

program
  .version('0.0.1')
  .command('server')
  .description('Start Allograph server')
  .action(function(req,optional){
    graphQLServer.run()
  });

program
  .version('0.0.1')
  .command('generate_graphql')
  .description('Inspect DB schema and generate GraphQL schema.js file')
  .action(function(req,optional){
    dbTranslator.translate();
  });

program.parse(process.argv);   