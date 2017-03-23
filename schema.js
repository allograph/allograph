import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var knex = require('./db_connection')

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a table called posts',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (post) {
          return post.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (post) {
          return post.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve (post) {
          return post.content;
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (post) {
          return knex('comments').where({ postId: post.id }).then(comments => {;
            return comments;
          })
        }
      },
      users: {
        type: User,
        resolve (post) {
          return knex('users').where({ id: post.userId }).then(users => {;
            return users[0];
          })
        }
      },
    };
  }
});


const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (user) {
          return user.id;
        }
      },
      first_name: {
        type: GraphQLString,
        resolve (user) {
          return user.first_name;
        }
      },
      last_name: {
        type: GraphQLString,
        resolve (user) {
          return user.last_name;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve (user) {
          return user.email;
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (user) {
          return knex('comments').where({ userId: user.id }).then(comments => {;
            return comments;
          })
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve (user) {
          return knex('posts').where({ userId: user.id }).then(posts => {;
            return posts;
          })
        }
      },
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comments',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (comment) {
          return comment.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve (comment) {
          return comment.content;
        }
      },
      posts: {
        type: Post,
        resolve (comment) {
          return knex('posts').where({ id: comment.postId }).then(posts => {;
            return posts[0];
          })
        }
      },
      users: {
        type: User,
        resolve (comment) {
          return knex('users').where({ id: comment.userId }).then(users => {;
            return users[0];
          })
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
        resolve (root, args) {
          return knex('users').where(args)
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
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
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
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            title: args.title,
            content: args.content,
            userId: args.userId,
          }).into('posts').then(id => {
            return knex('posts').where({ id: id[0] }).then(post => {
              return post[0];
            });
          });
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
          }
        },
        resolve (source, args) {
          return knex('posts').where({ id: arg.id }).returning('id').update({
            title: args.title,
            content: args.content,
          }).then(id => {
            return knex('posts').where({ id: id[0] }).then(post => {
              return post[0];
            });
          });
        }
      },
      deletePost: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('posts').where({ id: arg.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted posts: ' + numberOfDeletedItems);
          });
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
          content: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
          }).into('users').then(id => {
            return knex('users').where({ id: id[0] }).then(user => {
              return user[0];
            });
          });
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
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex('users').where({ id: arg.id }).returning('id').update({
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
          }).then(id => {
            return knex('users').where({ id: id[0] }).then(user => {
              return user[0];
            });
          });
        }
      },
      deleteUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('users').where({ id: arg.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted users: ' + numberOfDeletedItems);
          });
        }
      },
      addComment: {
        type: Comment,
        args: {
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          postId: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          userId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            content: args.content,
            postId: args.postId,
            userId: args.userId,
          }).into('comments').then(id => {
            return knex('comments').where({ id: id[0] }).then(comment => {
              return comment[0];
            });
          });
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
          }
        },
        resolve (source, args) {
          return knex('comments').where({ id: arg.id }).returning('id').update({
            content: args.content,
          }).then(id => {
            return knex('comments').where({ id: id[0] }).then(comment => {
              return comment[0];
            });
          });
        }
      },
      deleteComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('comments').where({ id: arg.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted comments: ' + numberOfDeletedItems);
          });
        }
      }
    };
  }
});

exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});