import { Trainer } from '../schema/custom_type_definitions'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

import {maskErrors, UserError} from 'graphql-errors';

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (user, args, context) {
          return user.id;
        }
      },
      username: {
        type: new GraphQLNonNull(Character),
        resolve (user, args, context) {
          return user.username;
        }
      },
      enabled: {
        type: GraphQLBoolean,
        resolve (user, args, context) {
          return user.enabled;
        }
      },
      last_login: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.last_login;
        }
      },
    };
  }
});

export { User }