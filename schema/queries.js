import {
  GraphQLObjectType,
  GrpahQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { User, Project } from '../generated/type_definitions'


module.exports.Query = {
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      usersProjects: {
        type: new GraphQLList(Project),
        args: {
          id: {
            type: GraphQLInt
          },
        },
        resolve (root, args, context) {
          var user = new UserClass()
          console.log('Request made $$$$$$$$$$')
          return user.userProjects(args);
        }
      },      
    }
  }
};
