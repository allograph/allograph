import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

const Users = new GraphQLObjectType({
  name: 'Users',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(users) {
          return users.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(users) {
          return users.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(users) {
          return users.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(users) {
          return users.email;
        }
      },
      createdAt: {
        type: timestamp with time zone,
        resolve(users) {
          return users.createdAt;
        }
      },
      updatedAt: {
        type: timestamp with time zone,
        resolve(users) {
          return users.updatedAt;
        }
      },
      comments: {
        type: GraphQLList(Comments),
        resolve(users) {
          return users.comments;
        }
      },
      posts: {
        type: GraphQLList(Posts),
        resolve(users) {
          return users.posts;
        }
      },
    };
  }
});

const Posts = new GraphQLObjectType({
  name: 'Posts',
  description: 'This is a table called posts',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(posts) {
          return posts.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(posts) {
          return posts.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve(posts) {
          return posts.content;
        }
      },
      createdAt: {
        type: timestamp with time zone,
        resolve(posts) {
          return posts.createdAt;
        }
      },
      updatedAt: {
        type: timestamp with time zone,
        resolve(posts) {
          return posts.updatedAt;
        }
      },
      users: {
        type: Users,
        resolve(posts) {
          return posts.users;
        }
      },
      comments: {
        type: GraphQLList(Comments),
        resolve(posts) {
          return posts.comments;
        }
      },
    };
  }
});

const Comments = new GraphQLObjectType({
  name: 'Comments',
  description: 'This is a table called comments',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(comments) {
          return comments.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve(comments) {
          return comments.content;
        }
      },
      createdAt: {
        type: timestamp with time zone,
        resolve(comments) {
          return comments.createdAt;
        }
      },
      updatedAt: {
        type: timestamp with time zone,
        resolve(comments) {
          return comments.updatedAt;
        }
      },
      users: {
        type: Users,
        resolve(comments) {
          return comments.users;
        }
      },
      posts: {
        type: Posts,
        resolve(comments) {
          return comments.posts;
        }
      },
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      Users: {
        type: new GraphQLList(Users),
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
          createdAt: {
            type: timestamp with time zone
          },
          updatedAt: {
            type: timestamp with time zone
          },
          comments: {
            type: GraphQLList(Comments)
          },
          posts: {
            type: GraphQLList(Posts)
          },
        },
        resolve (root, args) {
          return Db.models.Users.findAll({ where: args });
        }
      },
      Posts: {
        type: new GraphQLList(Posts),
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
          createdAt: {
            type: timestamp with time zone
          },
          updatedAt: {
            type: timestamp with time zone
          },
          users: {
            type: Users
          },
          comments: {
            type: GraphQLList(Comments)
          },
        },
        resolve (root, args) {
          return Db.models.Posts.findAll({ where: args });
        }
      },
      Comments: {
        type: new GraphQLList(Comments),
        args: {
          id: {
            type: GraphQLInt
          },
          content: {
            type: GraphQLString
          },
          createdAt: {
            type: timestamp with time zone
          },
          updatedAt: {
            type: timestamp with time zone
          },
          users: {
            type: Users
          },
          posts: {
            type: Posts
          },
        },
        resolve (root, args) {
          return Db.models.Comments.findAll({ where: args });
        }
      },
    };
  }
});