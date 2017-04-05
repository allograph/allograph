import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (user, args, context) {
          return user.id;
        }
      },
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.firstName;
        }
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve (user, args, context) {
          return user.email;
        }
      },
      password: {
        type: GraphQLString,
        resolve (user, args, context) {
          return user.password;
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (user, args, context) {
          return knex('comments').where({ userId: user.id });
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve (user, args, context) {
          return knex('posts').where({ userId: user.id });
        }
      },
    };
  }
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a table called posts',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (post, args, context) {
          return post.id;
        }
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (post, args, context) {
          return post.title;
        }
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (post, args, context) {
          return post.content;
        }
      },
      userId: {
        type: GraphQLInt,
        resolve (post, args, context) {
          return post.userId;
        }
      },
      user: {
        type: User,
        resolve (post, args, context) {
          return knex('users').where({ id: post.userId }).first();
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (post, args, context) {
          return knex('comments').where({ postId: post.id });
        }
      },
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comments',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (comment, args, context) {
          return comment.id;
        }
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (comment, args, context) {
          return comment.content;
        }
      },
      userId: {
        type: GraphQLInt,
        resolve (comment, args, context) {
          return comment.userId;
        }
      },
      postId: {
        type: GraphQLInt,
        resolve (comment, args, context) {
          return comment.postId;
        }
      },
      user: {
        type: User,
        resolve (comment, args, context) {
          return knex('users').where({ id: comment.userId }).first();
        }
      },
      post: {
        type: Post,
        resolve (comment, args, context) {
          return knex('posts').where({ id: comment.postId }).first();
        }
      },
    };
  }
});



export { User, Post, Comment }