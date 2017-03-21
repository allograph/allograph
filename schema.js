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
  connection: "postgresql://rachelminto:postgres@localhost/relay",
  searchPath: 'knex,public'
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a table called posts',
  fields () => {
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
      createdAt: {
        type: GraphQLString,
        resolve (post) {
          return post.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve (post) {
          return post.updatedAt;
        }
      },
      comments: {
        type: Comment,
        resolve (post) {
          return knex('comments').where({ id: post.comment_id }).then(comment => {;
            return comment[0];        
          })
        }
      },
      users: {
        type: User,
        resolve (post) {
          return knex('users').where({ id: post.user_id }).then(user => {;
            return user[0];        
          })
        }
      },
    };
  }
});

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This is a table called people',
  fields () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (person) {
          return person.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve (person) {
          return person.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve (person) {
          return person.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve (person) {
          return person.email;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve (person) {
          return person.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve (person) {
          return person.updatedAt;
        }
      },
    };
  }
});

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields () => {
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
      email: {
        type: GraphQLString,
        resolve (user) {
          return user.email;
        }
      },
      created_at: {
        type: GraphQLString,
        resolve (user) {
          return user.created_at;
        }
      },
      updated_at: {
        type: GraphQLString,
        resolve (user) {
          return user.updated_at;
        }
      },
      comments: {
        type: Comment,
        resolve (user) {
          return knex('comments').where({ id: user.comment_id }).then(comment => {;
            return comment[0];        
          })
        }
      },
      posts: {
        type: Post,
        resolve (user) {
          return knex('posts').where({ id: user.post_id }).then(post => {;
            return post[0];        
          })
        }
      },
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comments',
  fields () => {
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
          return knex('posts').where({ id: comment.post_id }).then(post => {;
            return post[0];        
          })
        }
      },
      users: {
        type: User,
        resolve (comment) {
          return knex('users').where({ id: comment.user_id }).then(user => {;
            return user[0];        
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
          },
          createdAt: {
            type: GraphQLString
          },
          updatedAt: {
            type: GraphQLString
          },
          comments: {
            type: GraphQLList(Comments)
          },
          users: {
            type: Users
          }
        },
        resolve (root, args) {
          return knex('posts').where(args)
        }
      },
      people: {
        type: new GraphQLList(Person),
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
            type: GraphQLString
          },
          updatedAt: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('people').where(args)
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
          },
          created_at: {
            type: GraphQLString
          },
          updated_at: {
            type: GraphQLString
          },
          comments: {
            type: GraphQLList(Comments)
          },
          posts: {
            type: GraphQLList(Posts)
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
          },
          posts: {
            type: Posts
          },
          users: {
            type: Users
          }
        },
        resolve (root, args) {
          return knex('comments').where(args)
        }
      },
    };
  }
});

exports.Schema = new GraphQLSchema({
  query: Query
});