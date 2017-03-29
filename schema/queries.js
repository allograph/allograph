import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var tables = require('../generated/models');

module.exports = {
  users: {
    type: new GraphQLList(User),
    args: {
      first_name: {
        type: GraphQLString
      },
      last_name: {
        type: GraphQLString
      },
    },
    resolve (root, args) {
      return knex('users').where(args)
    }
  },
}
