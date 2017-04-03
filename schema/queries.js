import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

module.exports.Query = {
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {   
    }
  }
};