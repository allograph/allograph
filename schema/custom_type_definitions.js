// import {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLSchema,
//   GraphQLList,
//   GraphQLBoolean,
//   GraphQLNonNull
// } from 'graphql';

// var knex = require('../database/connection');
// var jwt = require('jsonwebtoken');

// import { Tags_project } from '../generated/type_definitions'

// const Tag = new GraphQLObjectType({
//   name: 'Tag',
//   description: 'This is a table called tags',
//   fields: () => {
//     return {
//       id: {
//         type: new GraphQLNonNull(GraphQLInt),
//         resolve (tag, args, context) {
//           return tag.id;
//         }
//       },
//       title: {
//         type: GraphQLString,
//         resolve (tag, args, context) {
//           return tag.title;
//         }
//       },
//       super_cool_tags_projects: {
//         type: new GraphQLList(TagsProject),
//         resolve (Tag, args, context) {
//           return knex('tags_projects').where({ tag_id: Tag.id });
//         }
//       },
//     };
//   }
// });

// export { Tag }