import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import { Comment } from '../generated/type_definitions'

module.exports.Query = {
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return { 
      comments: {
        type: new GraphQLList(Comment),
        args: {
          id: {
            type: GraphQLInt
          },
          card_id: {
            type: GraphQLInt
          },
          content: {
            type: GraphQLString
          },
          limit: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          var comment = new CommentClass()
          return comment.comments(args).then(Comment => {
            return Comment
          });
        }
      },   
    }
  }
};