const dbData = require('./db_data.js').DBData;
var fs = require('fs');

function printMetadata(dbMetadata) {
  console.log(dbMetadata)

  for (var property in dbMetadata.tables) {
    if (dbMetadata.tables.hasOwnProperty(property)) {
      var data = fs.readFileSync('schema.js', 'utf-8');

      var newData = 'const ' + property + " = new GraphQLObjectType({" + "\n" + 
      "  name: '" + property + "',\n" + "  description: 'to be added." + "',\n"
      + "  fields () {\n" +
      "    return {\n\n"



      fs.writeFileSync('schema.js', data + newData, 'utf-8');

      console.log('readFileSync complete');
    };
  };
}

dbData.readSchema(printMetadata);

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