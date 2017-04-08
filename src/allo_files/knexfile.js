module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://rachelminto:postgres@localhost:5432/allograph_test',
    searchPath: 'knex,public',
    migrations: {
      directory: __dirname + '/test/migrations'
    },
    seeds: {
      directory: __dirname + '/test/seeds'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://rachelminto:postgres@localhost:5432/allograph',
    searchPath: 'knex,public',
    migrations: {
      directory: __dirname + '/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: 'knex,public',
    migrations: {
      directory: __dirname + '/migrations'
    }
  }
};