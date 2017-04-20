# Allograph

*A GraphQL framework that automatically generates a GraphQL schema from inspecting a PostgreSQL database and allows for easy configuration and modification.*

## Usage

To begin, clone this repo and run `npm install` and then `npm link` from your terminal. 

If you have an existing database that you would like to use with Allograph, update the database/connection.js file with your postgres database credentials (change username, password, and database in the example below, and the 5432 port if necessary).

Eg: `postgres://username:password@localhost:5432/database`

Once your credentials have been saved, you can run `allo schema` from your terminal to automatically create a /generated/schema.js file, which contains your GraphQL schema. In the /generated directory you'll also see that you now have default query, mutation, models and type definitions. You should never modify files in the /generated directory. If you need to make custom models, types, queries or mutations, you should code in the /schema directory.

At this point you're GraphQL server can be run with the command `allo server`. Looking at `http://localhost:3000/graphql` in your browser will show you the GraphiQL interface. Assuming you have a table 'users' with a column 'first_name', a GraphQL query can be entered in the lefthand pane:

    query {
      users {
        first_name
      }
    }

Which will return the following result when you click the triangle "Execute Query" button if you have two users in your users table:

    {
      "data": {
        "users": [
          {
            "first_name": "michael"
          },
          {
            "first_name": "marcia"
          }
        ]
      }
    }

Consult Allograph's [React Pokedex example](https://github.com/allograph/pokedex_allograph_example) for ideas on how you can utilize your fully-funtioning GraphQL server to make requests by copying and pasting the query from your GraphiQL interface into your code base once you're happy with the result.

Tables in your database can be modified using the migration system, which harnesses the power of Knex.js. To generate a new migration, use `allo create:migration <name>` in your command line. The name you provide along with a timestamp will be used to name your migration file, which can be found in the /migrations folder. You also have the option of customizing the migration to be for creating a new table with `allo create:migration <name> -c <tableName>`. After you're happy with the migration file, you can run `allo migrate` to persist your changes to the database. The migration can be rolled back with `allo migrate:rollback`. See the section for Command Line Tools below for more information on using Allograph's CLI, and see the [Knex.js API](http://knexjs.org/#Migrations-CLI) for more information on using knex migrations. 

## Conventions

Allograph's Postgres reflection assumes the following:
- Your tablenames are snake case and use the plural form (eg. trainer_clubs)
- If you have an id column, it is an auto-incrementing integer
- A junction table is only assumed when you have a table with three columns, two of which are foreign keys.

## Benefits

### Relation Detection

The relation detection feature allows for creation of type definitions that are already set up with has one and has many relationships whenever they can be detected based on the database structure itself. Allograph's database inspector identifies any table with three columns, two of which are foreign keys, as a junction table. The two tables that are referenced by the foreign keys in the junction tables will each be given Has Many references to each other. 

## Features

### Error Masking

Allograph harnesses the power of 'graphql-errors' to allow you to easily hide details of all errors from the client so you do not inadvertently leak information about your schema. 
In server.js:

    import {maskErrors, UserError} from 'graphql-errors';

    // More code here left out for brevity

    GraphQLServer.prototype.run = function() {
      const schema = require("./generated/schema.js").Schema;
      maskErrors(schema);   // including maskErrors(schema) will mask all errors. Can remove if you want to select individual errors to mask.

      app.use('/graphql', graphqlHTTP((req) => ({
        schema: schema,
        pretty: true,
        graphiql: true,
        context: req.context
      })));

      app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
    }

Use UserError in a resolve function to create your own custom error message.

import {maskErrors, UserError} from 'graphql-errors';

    const User = new GraphQLObjectType({
      name: 'User',
      description: 'This is a table called users',
      fields: () => {
        return {
          projects: {
            type: new GraphQLList(Project),
            resolve (user, args, context) {
              return knex('projects').where({ user_id: user })
              .on('query-error', function(error, obj) {
                throw new UserError('Unable to fetch users list.');
              })
            }
          },
        };
      }
    });      

### Caching per-Request

[DataLoader](https://github.com/facebook/dataloader) is a useful tool for caching per-request, avoiding repeatedly loading the same data in the context of a single request to your Application. The following is a example that preventing fetching the same pokemon in a single request.

    var getPokemon = function(id) {
      return knex('pokemons').where({ trainer_id: id })
      .then(function(result) {
        return result
      })
    }

    GraphQLServer.prototype.run = function() {
    // giving an array of keys, return an array of things (In this example, that would be an array of pokemons)
      const pokemonLoader = new DataLoader(
        keys => Promise.all(keys.map(getPokemon))
      )
      const loaders = {
        pokemon: pokemonLoader
      }

    // pass loaders to the context, so that it become accessible through the third auguments `context` in every resolver.

      buildSchema().then(function(schema) {
        maskErrors(schema);
        app.use('/graphql', graphqlHTTP((req) => ({
          schema: schema,
          pretty: true,
          graphiql: true,
          context: Object.assign(req.context, {
            GQLProxyBaseUrl: 'http://petstore.swagger.io/v2'
            }, { loaders }
          )
        })));
      });
      app.listen(port, () => console.log('Our app is running on http://localhost:' + port));
    }

In the pokemons resolving function, instead of using knex to fetch data, now we use loader to load the data

    pokemons: {
      type: new GraphQLList(Pokemon),
      resolve (trainer, args, context) {
        return context.loaders.pokemon.load(trainer.id)
      }
    },

### Authentication

We integrates [express-jwt](https://github.com/auth0/express-jwt) for authentication.

If you have a table named 'users' with columns 'email' and 'password', Allograph setup a default login mutation for you. Once the user is authenticated, the cliend side will receieve a JWT token. Send the JWT in the Authorization header (`Authorization: JWT <your_token>`) , and the current login user will be accessible through the third auguments `context` in every resolver. It can be used for authorization. 

The following is a example of authorization usage.

    resolve (root, args, context) {
      var current_user = context.user,
          postClass = new PostClass();

        if (current_user)
          return postClass.posts().then(posts => {
            // filter posts that is created by current user
            return posts.filter(post => {
              return post.userId === current_user.id;
            });
          });
        else {
          return postClass.posts()
        }
      }
    }

### Integration with REST API

We use [Swagger](http://swagger.io/) schema json file as a blueprint to build type and query definitions from REST API, and integrate with the type and query definitions coming from database. Then Allograph builds the very single GraphQL schema generated.

Once you have your `swagger.json` file ready, all you have to do is replacing the example `swagger.json` file under swagger folder and change `GQLProxyBaseUrl` in `server.js` file. After you run `allo schema` in your command line to regenerate your schema, you can do query on that API through GraphQL. We currently only support query, mutation is on our future todo list.

### Command Line Tools

`allo server`: Start your Allograph server

`allo -h`: List of all available commands and options.

`allo schema`: Inspect DB schema and generate GraphQL schema.js file.

`allo migrate`: Runs all migrations that have not yet been run.

`allo migrate:rollback`: Rolls back the latest migration group.

`allo create:migration <name>`: Creates migration file in /migrations folder.
    Optional flag: `-c, --create_table <tableName>`. Creates migration file that for adding a table of the tableName provided. Automatically provides a column for an incrementing primary key; additional columns can be added in the migration file.
