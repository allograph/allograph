const dbData = require('./db_data.js').DBData;
var fs = require('fs');

function printMetadata(dbMetadata) {
  psqlTypeToGraphQLType = {
    'character varying': 'GraphQLString',
    'integer': 'GraphQLInt',
  }

  var data = `import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'`
    
  fs.writeFileSync('schema.js', data, 'utf-8');  

  for (var property in dbMetadata.tables) {
    if (dbMetadata.tables.hasOwnProperty(property)) {
      var data = fs.readFileSync('schema.js', 'utf-8');
      var tableName = formatTableName(property)
      var description = dbMetadata.tables[property].description

      var newData = `\n
const ` + tableName + ` = new GraphQLObjectType({
  name: '` + tableName + `',
  description: '` + description + `',
  fields: () => {
    return {`

      for (var column in dbMetadata.tables[property].fields) {
        var psqlType = dbMetadata.tables[property].fields[column].data_type
        var columnData = '\n      ' + column + `: {
        type: ` + (psqlTypeToGraphQLType[psqlType] || 'GraphQLString') + `,
        resolve(` + property + `) {
          return ` + property + '.' + column + `;
        }
      },`


        newData += columnData
      }

      newData += `
    };
  }
});`

      fs.writeFileSync('schema.js', data + newData, 'utf-8');
    };
  };
}

dbData.readSchema(printMetadata);

var formatTableName = function(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// const Posts = new GraphQLObjectType({
//   name: Posts,
//   description: 'to be added.',
//   fields () {
//   return {

// const Post = new GraphQLObjectType({
//   name: 'Post',
//   description: 'Blog post',
//   fields () {
//     return {
//       id: {
//         type: GraphQLInt,
//         resolve (post) {
//           return post.id;
//         }
//       },
//     };
//   }
// });