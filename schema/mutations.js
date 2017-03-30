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
          return "Story title backwards: " + title.split("").reverse().join("")
        }
      },
    }      
  }
}