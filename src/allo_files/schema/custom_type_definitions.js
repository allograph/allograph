import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

import { maskErrors, UserError } from 'graphql-errors';
import { Pokemon } from '../generated/type_definitions'

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');

const Trainer = new GraphQLObjectType({
  name: 'Trainer',
  description: 'This is a table called trainers',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (trainer, args, context) {
          return trainer.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (trainer, args, context) {
          return trainer.name;
          // return knex('trainers').where({ some_id: args })
          // .on('query-error', function(error, obj) {
          //   throw new UserError('Unable to fetch trainer name.');
          // })
        }
      },
      pokemons: {
        type: new GraphQLList(Pokemon),
        resolve (trainer, args, context) {
          // return knex('pokemons').where({ trainer_id: trainer.id });
          return context.loaders.pokemon.load(trainer.id)
        }     
      },
      activePokemons: {
        type: new GraphQLList(Pokemon),
        resolve (trainer, args, context) {
          // return knex('pokemons').where({ trainer_id: trainer.id });
          // return context.loaders.pokemon.load(trainer.id)
          return knex('pokemons').where('name', 'like', 'P%');
        }     
      }      
    };
  }
});

export { Trainer }