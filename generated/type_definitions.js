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

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');

const Pokemon = new GraphQLObjectType({
  name: 'Pokemon',
  description: 'This is a table called pokemons',
  fields: () => {
    return {
      id: {
        type: GraphQLString,
        resolve (pokemon, args, context) {
          return pokemon.id;
        }
      },
      url: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (pokemon, args, context) {
          return pokemon.url;
        }
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (pokemon, args, context) {
          return pokemon.name;
        }
      },
      trainerId: {
        type: GraphQLString,
        resolve (pokemon, args, context) {
          return pokemon.trainer_id;
        }
      },
      trainer: {
        type: Trainer,
        resolve (Pokemon, args, context) {
          return knex('trainers').where({ id: Pokemon.trainer_id }).first();
        }
      },
    };
  }
});



export { Pokemon }