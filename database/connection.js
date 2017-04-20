module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://rachelminto:postgres@localhost:5432/gotealeaf_development',
  searchPath: 'knex,public'
});
