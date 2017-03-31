const express = require("express");
const graphHTTP = require("express-graphql");
const app = express();

var GraphQLServer = function () {};

GraphQLServer.prototype.run = function() {
  const schema = require("./generated/schema.js").Schema;

  app.use('/graphql', graphHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
  }));

  app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));
}

exports.GraphQLServer = new GraphQLServer();