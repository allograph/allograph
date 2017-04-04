import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { Trainer, Pokemon } from '../generated/type_definitions'

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
      Pokemon: {
        type: Pokemon,
        args: {
          id: {
            type: GraphQLString
          },
        },
        resolve(root, args, context) {
          return knex('pokemons').where({ id: args.id }).first();
        }      
      }
    }
  }
};
