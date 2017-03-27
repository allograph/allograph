var { buildSchema } = require('graphql'),
    fs = require('fs'),
    typeSchema = fs.readFileSync('./schema/graphql/type.graphql', 'utf-8'),
    querySchema = fs.readFileSync('./schema/graphql/query.graphql', 'utf-8'),
    mutationSchema = fs.readFileSync('./schema/graphql/mutation.graphql', 'utf-8');

var concatSchema = `schema {
  query: Query
  mutation: Mutation
}` + typeSchema + `\n` + querySchema + `\n` + mutationSchema

exports.Schema = buildSchema(concatSchema);