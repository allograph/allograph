const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      usersProjects: {
          type: new GraphQLList(Project),
          args: {
          id: {
            type: GraphQLInt
          },
        },
        resolve(root, args, context) {
          var user = new UserClass();
          console.log('Request made $$$$$$$$$$');
          return user.userProjects(args);
        }
      },
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          },
          first_name: {
            type: GraphQLString
          },
          last_name: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.users(args);
        }
      },
      projects: {
        type: new GraphQLList(Project),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          user_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
          return project.projects(args);
        }
      },
      users_projects: {
        type: new GraphQLList(Users_project),
        args: {
          id: {
            type: GraphQLInt
          },
          users_id: {
            type: GraphQLInt
          },
          projects_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var users_project = new Users_projectClass()
          return users_project.users_projects(args);
        }
      },
    };
  }
});

