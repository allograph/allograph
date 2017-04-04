const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
var cors = require('cors')
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

app.use(cors())

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
  const schema = require("./generated/schema.js").Schema;

  app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    pretty: true,
    graphiql: true,
    context: req.context
  })));

  app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();