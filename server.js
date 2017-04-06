const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
var cors = require('cors')
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');

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

var port = process.env.PORT || 4000;

var GraphQLServer = function () {};


const schema = require("./generated/schema.js").Schema;

app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  pretty: true,
  graphiql: false,
  context: req.context
})));

app.listen(port, () => console.log('Our app is running on http://localhost:' + port));



// exports.GraphQLServer = new GraphQLServer();
