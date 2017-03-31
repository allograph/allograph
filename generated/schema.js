import * as models from './models'
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
          var user = new models.User()
          return user.users(args);
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
          var project = new models.Project()
          return project.projects(args);
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
      createBackwardsTitle: {
        type: GraphQLString, 
        args: {
          title: {
            type: GraphQLString
          },
        },
        resolve(source, args) {
          var title = args.title;
          return "Story title backwards: " + title.split("").reverse().join("");
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
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var user = new models.User()
          return user.createUser(args);
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
        resolve (root, args) {
          var user = new models.User()
          return user.updateUser(args);
        }
      },
      addProject: {
        type: Project,
        args: {
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var project = new models.Project()
          return project.createProject(args);
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
        resolve (root, args) {
          var project = new models.Project()
          return project.updateProject(args);
        }
      },
      deleteProject: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var project = new models.Project()
          return project.deleteProject(args);
        }
      }
    };
  }
});exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});