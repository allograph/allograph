import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var knex = require('knex')({
  client: 'pg',
  connection: "postgresql://tingc:tingc@localhost/blog",
  searchPath: 'knex,public'
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Blog post',
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
      author: {
        type: User,
        resolve (post) {
          return post.getUser();
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (post) {
          return post.getComments();
        }
      }
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'Blog comment',
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
      post: {
        type: Post,
        resolve (comment) {
          return comment.getPost();
        }
      },
      author: {
        type: User,
        resolve (comment) {
          return comment.getUser();
        }
      }
    };
  }
});

const User = new GraphQLObjectType({
  name: 'User',
  description: 'Blog User',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (user) {
          return user.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve (user) {
          return user.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve (user) {
          return user.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve (user) {
          return user.email;
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve (user) {
          return user.getPosts();
        }
      }
    };
  }
});

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
          email: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('users').where(args)
        }
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          return knex('posts').where(args)
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (root, args) {
          return knex('comments').where(args)
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
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
        resolve (source, args) {
          return knex.returning('id').insert({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase()
          }).into('users').then(id => {
            return knex('users').where({ 'id': id[0] });
          });
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
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.insert({
            title: args.title,
            content: args.content,
            userId: args.userId
          }).into('posts');
        }
      },
      updatePost: {
        type: Post,
        args: {
          title: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          },
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return Db.models.post.find({
            where: { id: args.id }
          }).then(post => {
            return post.update({
              title: args.title,
              content: args.content
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
          Db.models.post.destroy({
            where: { id: args.id }
          });
        }
      },
      addComment: {
        type: Comment,
        args: {
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          post_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.insert({
            title: args.title,
            content: args.content,
            userId: args.userId
          }).into('comments');
        }
      },
      updateComment: {
        type: Comment,
        args: {
          content: {
            type: GraphQLString
          },
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return Db.models.comment.find({
            where: { id: args.id }
          }).then(comment => {
            return comment.update({
              content: args.content
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
          Db.models.comment.destroy({
            where: { id: args.id }
          });
        }
      },
    };
  }
});

exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});