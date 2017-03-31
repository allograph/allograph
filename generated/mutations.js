const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
      createBackwardsTitle: {
        type: GraphQLString, 
        args: {
          title: {
            type: GraphQLString
          },
        },
        resolve(source, args) {
          var title = args.title;
          return "Story title backwards: " + title.split("").reverse().join("");
        }
      },
      addUser: {
        type: User,
        args: {
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var user = new models.User()
          return user.createUser(args);
        }
      },
      updateUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var user = new models.User()
          return user.updateUser(args);
        }
      },
      addProject: {
        type: Project,
        args: {
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var project = new models.Project()
          return project.createProject(args);
        }
      },
      updateProject: {
        type: Project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var project = new models.Project()
          return project.updateProject(args);
        }
      },
      deleteProject: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var project = new models.Project()
          return project.deleteProject(args);
        }
      }
    };
  }
});