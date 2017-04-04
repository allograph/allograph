const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const swaggerSchema = require('./swagger');

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
  // comment the code below if you want to use swagger schema
  const schema = require("./generated/schema.js").Schema;
  app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    pretty: true,
    graphiql: true,
    context: req.context
  })));

  // Below is an example of swagger schema to graphql
  swaggerSchema('./swagger/swagger.json').then(schema => {
    app.use('/graphql', graphqlHTTP(() => {
      return {
        schema,
        context: {
          GQLProxyBaseUrl: 'http://petstore.swagger.io/v2'
        },
        graphiql: true
      };
    }));
  });

  app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();