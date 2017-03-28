module.exports = require('knex')({
  client: 'pg',
  connection: 'postgres://tingc:tingc@localhost:5432/blog',
  searchPath: 'knex,public'
});
