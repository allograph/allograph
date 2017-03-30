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
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (user) {
          return user.id;
        }
      },
      first_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user) {
          return user.first_name;
        }
      },
      last_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user) {
          return user.last_name;
        }
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user) {
          return user.email;
        }
      },
      projects: {
        type: new GraphQLList(Project),
        resolve (user) {
          return knex('projects').where({ user_id: user.id }).then(projects => {;
            return projects;
          });
        }
      },
    };
  }
});

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'This is a table called projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
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
      users: {
        type: User,
        resolve (project) {
          return knex('users').where({ id: project.user_id }).then(users => {;
            return users[0];
          });
        }
      },
    };
  }
});

