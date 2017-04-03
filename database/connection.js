module.exports = require('knex')({
  client: 'pg',
  connection: 'postgres://rachelminto:postgres@localhost:5432/pokedex',
  searchPath: 'knex,public'
});
