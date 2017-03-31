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
      // projects: {
      //   type: new GraphQLList(Project),
      //   args: {
      //     id: {
      //       type: GraphQLInt
      //     },
      //     title: {
      //       type: GraphQLString
      //     }
      //   },
      //   resolve (root, args) {
      //     return knex('projects').where(args)
      //   }
      // },
    }
  }
};

