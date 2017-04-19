const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
var cors = require('cors')
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const buildSchema = require('./schema/build_schema.js');
var knex = require('./database/connection');
var knexLogger = require('knex-logger');
import {maskErrors, UserError} from 'graphql-errors';

app.use(cors())

// Uncomment the following line if you'd like to console log your sql statements.
// app.use(knexLogger(knex));

app.use('/graphql', expressJWT({
  secret: 'allograph-secret',
  credentialsRequired: false
}));

app.use('/graphql', function(req, res, done) {
  const user = req.user || {};
  req.context = user;
  done();
});

var port = process.env.PORT || 4000;
var GraphQLServer = function () {};

GraphQLServer.prototype.run = function() {
  const loaders = {
  }  
  buildSchema().then(function(schema) {
    // maskErrors(schema);
    app.use('/graphql', graphqlHTTP((req) => ({
      schema: schema,
      pretty: true,
      graphiql: true,
      context: Object.assign(req.context, {
        GQLProxyBaseUrl: 'http://petstore.swagger.io/v2'
        }, { loaders }
      )
    })));
  });
  app.listen(port, () => console.log('Our app is running on http://localhost:' + port));
}

exports.GraphQLServer = new GraphQLServer();