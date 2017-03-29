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
        type: new GraphQLObjectType,
        args: {
          cost: { type: GraphQLInt }
        },
        resolve: (root, args) => {
          return args.cost * 1.15
        }
      },
    }
  }
};

// module.exports.Query = new GraphQLObjectType({
//   name: 'Query',
//   description: 'Root query object',
//   fields: () => {
//     return { 
//       tax: {
//         type: new GraphQLObjectType,
//         args: {
//           cost: { type: GraphQLInt }
//         },
//         resolve: (root, args) => {
//           return args.cost * 1.15
//         }
//       },
//     }
//   }
// });

