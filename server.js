const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken')

app.use('/graphql', expressJWT({
  secret: 'allograph-secret',
  credentialsRequired: false
}));

app.use('/graphql', function(req, res, done) {
  const authToken = req.user || {};
  req.context = { user: authToken }
  done();
});

var GraphQLServer = function () {};

GraphQLServer.prototype.run = function() {
  const schema = require("./generated/schema.js").Schema;

  app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    pretty: true,
    graphiql: true,
    context: req.context
  })));

  app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();