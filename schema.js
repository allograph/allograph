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
        type: new GraphQLList(Comment),
        resolve (post) {
          return knex('comments').where({ postId: post.id }).then(comments => {;
            return comments;        
          })
        }
      },
      users: {
        type: new GraphQLList(User),
        resolve (post) {
          return knex('users').where({ userId: post.id }).then(users => {;
            return users;        
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
        type: new GraphQLList(Post),
        resolve (comment) {
          return knex('posts').where({ postId: comment.id }).then(posts => {;
            return posts;        
          })
        }
      },
      users: {
        type: new GraphQLList(User),
        resolve (comment) {
          return knex('users').where({ userId: comment.id }).then(users => {;
            return users;        
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

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      addPost: {
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
          createdAt: {
            type: new GraphQLNonNull(GraphQLString)
          },
          updatedAt: {
            type: new GraphQLNonNull(GraphQLString)
          },
          comments: {
            type: new GraphQLString
          },
          users: {
            type: new GraphQLString
          },
        resolve (source, args) {
          return knex.returning('id').insert({
            id: args.id,
            title: args.title,
            content: args.content,
            createdAt: args.createdAt,
            updatedAt: args.updatedAt,
            comments: args.comments,
            users: args.users,
          }).into('posts').then(id => {
            return knex('posts').where({ id: id[0] }).then(post => {
              return post[0];
            });
          };
        }
      },
      addPerson: {
        type: Person,
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
          },
          createdAt: {
            type: new GraphQLNonNull(GraphQLString)
          },
          updatedAt: {
            type: new GraphQLNonNull(GraphQLString)
          },
        resolve (source, args) {
          return knex.returning('id').insert({
            id: args.id,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            createdAt: args.createdAt,
            updatedAt: args.updatedAt,
          }).into('people').then(id => {
            return knex('people').where({ id: id[0] }).then(person => {
              return person[0];
            });
          };
        }
      },
      addUser: {
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
            type: new GraphQLString
          },
          created_at: {
            type: new GraphQLNonNull(GraphQLString)
          },
          updated_at: {
            type: new GraphQLNonNull(GraphQLString)
          },
          comments: {
            type: new GraphQLString
          },
          posts: {
            type: new GraphQLString
          },
        resolve (source, args) {
          return knex.returning('id').insert({
            id: args.id,
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
            created_at: args.created_at,
            updated_at: args.updated_at,
            comments: args.comments,
            posts: args.posts,
          }).into('users').then(id => {
            return knex('users').where({ id: id[0] }).then(user => {
              return user[0];
            });
          };
        }
      },
      addComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          posts: {
            type: new GraphQLString
          },
          users: {
            type: new GraphQLString
          },
        resolve (source, args) {
          return knex.returning('id').insert({
            id: args.id,
            content: args.content,
            posts: args.posts,
            users: args.users,
          }).into('comments').then(id => {
            return knex('comments').where({ id: id[0] }).then(comment => {
              return comment[0];
            });
          };
        }
      },
    };
  }
});

exports.Schema = new GraphQLSchema({
  query: Query
});