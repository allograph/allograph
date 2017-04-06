module.exports = require('knex')({
  client: 'pg',
<<<<<<< HEAD
  connection: process.env.DATABASE_URL || 'postgres://rachelminto:postgres@localhost:5432/pokedex',
=======
  connection: 'postgres://tingc:tingc@localhost:5432/blog',
>>>>>>> swagger
  searchPath: 'knex,public'
});
