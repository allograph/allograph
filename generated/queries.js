const queryFields = {
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          },
          firstName: {
            type: GraphQLString
          },
          lastName: {
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
      tags: {
        type: new GraphQLList(Tag),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var tag = new TagClass()
          return tag.tags(args);
        }
      },
      tagsProjects: {
        type: new GraphQLList(TagsProject),
        args: {
          id: {
            type: GraphQLInt
          },
          projectId: {
            type: GraphQLInt
          },
          tagId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var tagsProject = new TagsProjectClass()
          return tagsProject.tagsProjects(args);
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
          userId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
          return project.projects(args);
        }
      },
      usersProjects: {
        type: new GraphQLList(UsersProject),
        args: {
          id: {
            type: GraphQLInt
          },
          usersId: {
            type: GraphQLInt
          },
          projectsId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var usersProject = new UsersProjectClass()
          return usersProject.usersProjects(args);
        }
      },
    };

