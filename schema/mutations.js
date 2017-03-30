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
      deleteUser: {}
    };
  }
};