const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
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
      },
      addTag: {
        type: Tag,
        args: {
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var tag = new TagClass()
          return tag.createTag(args);
        }
      },
      updateTag: {
        type: Tag,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var tag = new TagClass()
          return tag.updateTag(args);
        }
      },
      deleteTag: {
        type: Tag,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var tag = new TagClass()
          return tag.deleteTag(args);
        }
      },
      addTags_project: {
        type: Tags_project,
        args: {
          project_id: {
            type: GraphQLInt
          },
          tag_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var tags_project = new Tags_projectClass()
          return tags_project.createTags_project(args);
        }
      },
      updateTags_project: {
        type: Tags_project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          project_id: {
            type: GraphQLInt
          },
          tag_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var tags_project = new Tags_projectClass()
          return tags_project.updateTags_project(args);
        }
      },
      deleteTags_project: {
        type: Tags_project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var tags_project = new Tags_projectClass()
          return tags_project.deleteTags_project(args);
        }
      },
      addProject: {
        type: Project,
        args: {
          title: {
            type: GraphQLString
          },
          user_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
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
          },
          user_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
          return project.updateProject(args);
        }
      },
      deleteProject: {
        type: Project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
          return project.deleteProject(args);
        }
      },
      addUsers_project: {
        type: Users_project,
        args: {
          users_id: {
            type: GraphQLInt
          },
          projects_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var users_project = new Users_projectClass()
          return users_project.createUsers_project(args);
        }
      },
      updateUsers_project: {
        type: Users_project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
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
          return users_project.updateUsers_project(args);
        }
      },
      deleteUsers_project: {
        type: Users_project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var users_project = new Users_projectClass()
          return users_project.deleteUsers_project(args);
        }
      }
    };
  }
});