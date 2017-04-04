import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { Trainer } from '../generated/type_definitions'

module.exports.Query = {
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {  
      Trainer: {
          type: Trainer,
          args: {
          name: {
            type: GraphQLString
          },
        },
        resolve(root, args, context) {
          return knex('trainers').where({ name: args.name }).first();
        }
      },   
    }
  }
};