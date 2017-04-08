/* This is an example of code that you can put in schema/queries.js 
if you'd like to provide your own custom queries. 
To override the default query for a table in your database,
add an empty object here like 'users', where users is your table name. */


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
      tax: {
        type: GraphQLInt,
        args: {
          cost: { type: GraphQLInt }
        },
        resolve (root, args) {
          return args.cost * 1.15
        }
      },
      users: {
      },     
    }
  }
};

