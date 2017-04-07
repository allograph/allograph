const {GraphQLSchema, GraphQLObjectType} = require('graphql');
const queryFields = require("../generated/schema.js").queryFields;
const mutationFields = require("../generated/schema.js").mutationFields;
var fs = require('fs');

const build = function() {
  if (fs.statSync('./swagger/swagger.json').size < 2) {
    const swaggerQuery = require('../swagger').queryFields('./swagger/swagger.json');
    const swaggerMutation = require('../swagger').mutationFields('./swagger/swagger.json');

    return Promise.all([swaggerQuery, queryFields, swaggerMutation, mutationFields]).then(function(fields) {
      const Query = new GraphQLObjectType({
        name: 'Query',
        description: 'Root query object',
        fields: () => {
          return Object.assign({}, fields[0], fields[1]);
        }
      });

      const Mutation = new GraphQLObjectType({
        name: 'Mutation',
        description: 'Functions to set stuff',
        fields: () => {
          return Object.assign({}, fields[2], fields[3]);
        }
      });

      return new GraphQLSchema({ query: Query, mutation: Mutation });
    });
  } else {
    return Promise.all([queryFields, mutationFields]).then(function(fields) {
      const Query = new GraphQLObjectType({
        name: 'Query',
        description: 'Root query object',
        fields: () => {
          return Object.assign({}, fields[0]);
        }
      });

      const Mutation = new GraphQLObjectType({
        name: 'Mutation',
        description: 'Functions to set stuff',
        fields: () => {
          return Object.assign({}, fields[1]);
        }
      });

      return new GraphQLSchema({ query: Query, mutation: Mutation });
    });
  }
};

module.exports = build;