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
          return knex('pokemons').where({ trainer_id: trainer.id }).then(pokemons => {;
            return pokemons;
          });
        }
      },
    };
  }
});

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
      trainer_id: {
        type: GraphQLString,
        resolve (pokemon, args, context) {
          return pokemon.trainer_id;
        }
      },
      trainers: {
        type: Trainer,
        resolve (pokemon, args, context) {
          return knex('trainers').where({ id: pokemon.trainer_id }).then(trainers => {;
            return trainers[0];
          });
        }
      },
    };
  }
});



export { Trainer, Pokemon }