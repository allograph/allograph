var { buildSchema } = require('graphql'),
    fs = require('fs'),
    schema = fs.readFileSync('./schema/schema.graphql', 'utf-8');

exports.Schema = buildSchema(schema);