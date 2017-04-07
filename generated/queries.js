const queryFields = {
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
          trainerId: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var pokemon = new PokemonClass()
          return pokemon.pokemons(args);
        }
      },
    };

