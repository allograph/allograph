module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://rachelminto:postgres@localhost:5432/library',
  searchPath: 'knex,public'
});
