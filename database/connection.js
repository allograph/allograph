module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://rachelminto:postgres@localhost:5432/pokedex',
  searchPath: 'knex,public'
});
