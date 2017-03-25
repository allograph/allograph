import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection')

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
      email: {
        type: GraphQLString,
        resolve (user) {
          return user.email;
        }
      },
    };
  }
});

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'This is a table called projects',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (project) {
          return project.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (project) {
          return project.title;
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
      projects: {
        type: new GraphQLList(Project),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('projects').where(args)
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
      addUser: {
        type: User,
        args: {
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
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
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return knex('users').where({ id: args.id }).returning('id').update({
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
          knex('users').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted users: ' + numberOfDeletedItems);
          });
        }
      },
      addProject: {
        type: Project,
        args: {
          title: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            title: args.title,
          }).into('projects').then(id => {
            return knex('projects').where({ id: id[0] }).then(project => {
              return project[0];
            });
          });
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
          }
        },
        resolve (source, args) {
          return knex('projects').where({ id: args.id }).returning('id').update({
            title: args.title,
          }).then(id => {
            return knex('projects').where({ id: id[0] }).then(project => {
              return project[0];
            });
          });
        }
      },
      deleteProject: {
        type: Project,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('projects').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted projects: ' + numberOfDeletedItems);
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