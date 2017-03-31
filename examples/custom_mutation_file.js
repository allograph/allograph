/* This is an example of code that you can put in schema/mutations.js 
if you'd like to provide your own custom functions. 
To override the default add, update and delete functions,
add an empty object here like 'deleteUser', where User is your singular, 
capitalized table name. */

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
      deleteUser: {},
      createBackwardsTitle: {
        type: GraphQLString,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
        },
        resolve (source, args) {
          var title = args.title
          return "Story title backwards: " + title.split("").reverse().join("")
        }
      },
    }      
  }
}