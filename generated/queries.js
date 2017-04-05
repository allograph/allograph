const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
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
          },
          password: {
            type: GraphQLString
          }
        },
        resolve (root, args, context) {
          var user = new UserClass()
          return user.users(args);
        }
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          },
          userId: {
            type: GraphQLInt
          }
        },
        resolve (root, args, context) {
          var post = new PostClass()
          return post.posts(args);
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        args: {
          id: {
            type: GraphQLInt
          },
          content: {
            type: GraphQLString
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
          return comment.comments(args);
        }
      },
    };
  }
});

