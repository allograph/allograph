import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';


module.exports.Mutation = {
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
      }
    };
  }
};