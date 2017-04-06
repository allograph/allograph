const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
var cors = require('cors')
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
var knex = require('./database/connection');
var knexLogger = require('knex-logger');

app.use(cors())

app.use('/graphql', expressJWT({
  secret: 'allograph-secret',
  credentialsRequired: false
}));

app.use(knexLogger(knex));

app.use('/graphql', function(req, res, done) {
  const user = req.user || {};
  req.context = user;
  done();
});

var getPerson = function(id) {
  return knex('users').where({ id: id }).first().then(function(result) {
    console.log('Trying to fetch!')
    console.log(result)
    return result
  })
}

var GraphQLServer = function () {};

GraphQLServer.prototype.run = function() {
  const schema = require("./generated/schema.js").Schema;

  app.use('/graphql', graphqlHTTP((req) => {
    const personLoader = new DataLoader(
      keys => Promise.all(keys.map(getPerson))
    )
    const loaders = {
      person: personLoader
    }
    return {
      schema: schema,
      pretty: true,
      graphiql: true,
      context: { loaders }
    }
  }));

  app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();