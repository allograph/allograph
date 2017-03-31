module.exports = require('knex')({
  client: 'pg',
  connection: 'postgres://rachelminto:postgres@localhost:5432/antrello_app',
  searchPath: 'knex,public'
});
