const mutationFields = {
      addUser: {
        type: User,
        args: {
          enabled: {
            type: GraphQLBoolean
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.createUser(args);
        }
      },
      updateUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          enabled: {
            type: GraphQLBoolean
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.updateUser(args);
        }
      },
      deleteUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.deleteUser(args);
        }
      }
    };