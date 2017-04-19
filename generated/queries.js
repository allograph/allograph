const queryFields = {
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
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          },
          enabled: {
            type: GraphQLBoolean
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.users(args);
        }
      },
    };

