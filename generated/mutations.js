const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
      login: {
        type: GraphQLString,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args, context) {
          var user = new UserClass();
          return user.users(args).then(user => {
            return jwt.sign({ user: user[0] }, 'allograph-secret' );
          });
        }
      },
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
            type: GraphQLString
          },
          password: {
            type: GraphQLString
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
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.updateUser(args);
        }
      },
      deleteUser: {
        type: GraphQLString,
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
      addPost: {
        type: Post,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var post = new PostClass()
          return post.createPost(args);
        }
      },
      updatePost: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var post = new PostClass()
          return post.updatePost(args);
        }
      },
      deletePost: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var post = new PostClass()
          return post.deletePost(args);
        }
      },
      addComment: {
        type: Comment,
        args: {
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: GraphQLInt
          },
          postId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var comment = new CommentClass()
          return comment.createComment(args);
        }
      },
      updateComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: GraphQLInt
          },
          postId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var comment = new CommentClass()
          return comment.updateComment(args);
        }
      },
      deleteComment: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args, context) {
          var comment = new CommentClass()
          return comment.deleteComment(args);
        }
      }
    };
  }
});