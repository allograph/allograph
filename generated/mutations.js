const Mutation = new GraphQLObjectType({
  name: 'Mutation',
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
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex('users').where({ id: args.id }).del().then(numberOfDeletedItems => {
            return 'Number of deleted users: ' + numberOfDeletedItems;
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
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex('projects').where({ id: args.id }).del().then(numberOfDeletedItems => {
            return 'Number of deleted projects: ' + numberOfDeletedItems;
          });
        }
      }
    };
  }
});