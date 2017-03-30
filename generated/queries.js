const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () {
    return {
      tax: {
        type: Int,
        args: {
          cost: {
            type: Int
          },
        },
        resolve(root, args) {
          return args.cost * 1.15;
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
          }
        },
        resolve (root, args) {
          return knex('comments').where(args)
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
          }
        },
        resolve (root, args) {
          return knex('posts').where(args)
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
        resolve (root, args) {
          return knex('tags').where(args)
        }
      },
      tags_posts: {
        type: new GraphQLList(Tags_post),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          return knex('tags_posts').where(args)
        }
      },
    };
  }
});