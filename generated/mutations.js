const mutationFields = {
      addUser: {
        type: User,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
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
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
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
      addTagsProject: {
        type: TagsProject,
        args: {
          projectId: {
            type: GraphQLInt
          },
          tagId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var tagsProject = new TagsProjectClass()
          return tagsProject.createTagsProject(args);
        }
      },
      updateTagsProject: {
        type: TagsProject,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
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
          return tagsProject.updateTagsProject(args);
        }
      },
      addProject: {
        type: Project,
        args: {
          title: {
            type: GraphQLString
          },
          userId: {
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
          userId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var project = new ProjectClass()
          return project.updateProject(args);
        }
      },
      addUsersProject: {
        type: UsersProject,
        args: {
          usersId: {
            type: GraphQLInt
          },
          projectsId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var usersProject = new UsersProjectClass()
          return usersProject.createUsersProject(args);
        }
      },
      updateUsersProject: {
        type: UsersProject,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
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
          return usersProject.updateUsersProject(args);
        }
      }
    };