const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const buildSchema = require('./schema/build_schema.js');

app.use('/graphql', expressJWT({
  secret: 'allograph-secret',
  credentialsRequired: false
}));

app.use('/graphql', function(req, res, done) {
  const user = req.user || {};
  req.context = user;
  done();
});

var GraphQLServer = function () {};

GraphQLServer.prototype.run = function() {
  buildSchema().then(function(schema) {
    app.use('/graphql', graphqlHTTP((req) => ({
      schema: schema,
      pretty: true,
      graphiql: true,
      context: Object.assign(req.context, {
        GQLProxyBaseUrl: 'http://petstore.swagger.io/v2'
      })
    })));
  });

  app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();