const Query = new GraphQLObjectType({
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
      trainers: {
        type: new GraphQLList(Trainer),
        args: {
          id: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var trainer = new TrainerClass()
          return trainer.trainers(args);
        }
      },
      pokemons: {
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
          trainer_id: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var pokemon = new PokemonClass()
          return pokemon.pokemons(args);
        }
      },
    };
  }
});

