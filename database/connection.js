module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://rachelminto:postgres@localhost:5432/allograph',
  searchPath: 'knex,public'
});
