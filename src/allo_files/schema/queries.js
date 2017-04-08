import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { Pokemon } from '../generated/type_definitions'

import { Trainer } from './custom_type_definitions'
import { Pokemon as PokemonClass } from './models/pokemon'

module.exports.Query = {
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      pokemonsStartWithP: {
        type: new GraphQLList(Pokemon),
        args: {
          id: {
            type: GraphQLString
          },
          url: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          },
          trainerId: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          return knex('pokemons').where('name', 'like', 'P%');
        }
      },      
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