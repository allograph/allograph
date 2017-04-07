import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection');
var jwt = require('jsonwebtoken');

import { Pokemon } from '../generated/type_definitions'

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
        }
      },
      pokemons: {
        type: new GraphQLList(Pokemon),
        resolve (trainer, args, context) {
          return knex('pokemons').where({ trainer_id: trainer.id });
        }
      },
      favoritePokemons: {
        type: new GraphQLList(Pokemon),
        resolve (trainer, args, context) {
          return knex('pokemons').where({ trainer_id: trainer.id });
        }
      },      
    };
  }
});

export { Trainer }