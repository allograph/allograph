var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema, printSchema, typeFromAST, parse, TypeInfo } = require('graphql');
var knex = require('./database/connection')
var fs = require('fs');
var typeSchema = fs.readFileSync('./schema/graphql/type.graphql', 'utf-8')
var querySchema = fs.readFileSync('./schema/graphql/query.graphql', 'utf-8')
var mutationSchema = fs.readFileSync('./schema/graphql/mutation.graphql', 'utf-8')
var concatSchema = `schema {
  query: Query
  mutation: Mutation
}` + typeSchema + `\n` + querySchema + `\n` + mutationSchema

var ast = parse(querySchema);
var schema = buildSchema(concatSchema);
var typeInfo = new TypeInfo(schema);
console.log(typeInfo.getParentType());
console.log(ast.definitions[0].name.value) // Type Name ex:User, Query, Mutation
console.log(ast.definitions[0].fields[0].name.value) // Field Name ex: id, users
console.log(ast.definitions[0].fields[0].arguments)
console.log(typeFromAST(schema, ast.definitions[0].fields[0].type)) // return Type
// var jwt = require('express-jwt');
// var authenticate = jwt({
//   secret: 'CLIENT_SECRET',
//   audience: 'CLIENT_ID'
// });
// var schema = require('./schema/schema.js').Schema;
// fs.writeFile('schema.graphql', printSchema(schema), 'utf8')
// This class implements the User GraphQL type
// type-based model
class User {
  // default reslove functions -> call back functions?
  // regenerate every time when there is a migration
  users(args) {
    return knex('users').where(args).then(users => {
      return users
    });
  }

  getName(args) {
    return knex.where(args).select('firstName', 'lastName').from('users').then(names => {
      return names.map(function(name) {
        return name.firstName + ', ' + name.lastName
      });
    });
  }

  createUser(args) {
    return knex.returning('id').insert({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email || "",
    }).into('users').then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  updateUser(args) {
    return knex('users').where({ id: args.id }).returning('id').update({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email
    }).then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  deleteUser(id) {
    return knex('users').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted users: ' + numberOfDeletedItems;
    });
  }
}

// The root provides the top-level API endpoints
var root = {
  users: function (args) {
    var user = new User;
    return user.users(args);
  },
  userName: function(args) {
    var user = new User;
    return user.getName(args)
  },
  addUser: function(args) {
    var user = new User;
    return user.createUser(args);
  },
  updateUser: function(args) {
    var user = new User;
    return user.updateUser(args);
  },
  deleteUser: function({id}) {
    var user = new User;
    return user.deleteUser(id);
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');