const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
      addTrainer: {
        type: Trainer,
        args: {
          name: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var trainer = new TrainerClass()
          return trainer.createTrainer(args);
        }
      },
      updateTrainer: {
        type: Trainer,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var trainer = new TrainerClass()
          return trainer.updateTrainer(args);
        }
      },
      deleteTrainer: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args, context) {
          var trainer = new TrainerClass()
          return trainer.deleteTrainer(args);
        }
      },
      addPokemon: {
        type: Pokemon,
        args: {
          url: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          trainer_id: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var pokemon = new PokemonClass()
          return pokemon.createPokemon(args);
        }
      },
      updatePokemon: {
        type: Pokemon,
        args: {
          id: {
            type: GraphQLString
          },
          url: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          trainer_id: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var pokemon = new PokemonClass()
          return pokemon.updatePokemon(args);
        }
      },
      deletePokemon: {
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var pokemon = new PokemonClass()
          return pokemon.deletePokemon(args);
        }
      }
    };
  }
});