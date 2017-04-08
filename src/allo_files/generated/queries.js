const queryFields = {
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
          },
        },
        resolve(root, args, context) {
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

