# Allograph

*A GraphQL framework that automatically generates a GraphQL schema from inspecting a PostgreSQL database and allows for easy configuration and modification.*

## Usage

To begin, clone this repo and run 'npm install' and then 'npm link' from your terminal. 

If you have an existing database that you would like to use with Allograph, update the database/connection.js file with your postgres database credentials (change username, password, and database in the example below, and the 5432 port if necessary). 
Eg: 'postgres://username:password@localhost:5432/database'

Once your credentials have been saved, you can run 'allo generate:graphql' from your terminal to automatically create a 'schema/schema.js' file, which contains your GraphQL schema, a schema/schema.json file for your information, and bookshelf/models/[tablename] for each of your tables. If you do not wish to use Bookshelf (an ORM), you can run 'allo generate:graphql -n' instead, which will create the GraphQL schema without bookshelf models.

At this point you're GraphQL server can be run with the command 'allo server'. Looking at 'http://localhost:3000/graphql' in your browser will show you the GraphiQL interface. Assuming you have a table 'users' with a column 'first_name', a GraphQL query can be entered in the lefthand pane:

```javascript
query {
 users {
  first_name
  }
}
```
Which will return the following result when you click the triangle "Execute Query" button if you have two users in your users table:

```javascript
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
```

Consult send_request.js for ideas on how you can utilize your fully-funtioning GraphQL server to make requests by copying and pasting the query from your g]GraphiQL interface into your code base once you're happy with the result.

Tables in your database can be modified using the migration system, which harnesses the power of Knex.js. To generate a new migration, use 'allo create:migration <name>' in your command line. The name you provide along with a timestamp will be used to name your migration file, which can be found in the /migrations folder. You also have the option of customizing the migration to be for creating a new table with 'allo create:migration <name> -c <tableName>'. After you're happy with the migration file, you can run 'allo migrate' to persist your change to the database. The migration can be rolled back with 'allo migrate:rollback'. See the section for Command Line Tools below for more information on using Allograph's CLI, and see the [Knex.js API](http://knexjs.org/#Migrations-CLI) for more information on using knex migrations. 

If you need to customize the relations that are automatically detected based on the database schema, you can do so by adding a JSON object to the relations.json file. You cn specify the style as 'supplement' or 'override'. Choosing supplement will add the specified relationship in addition to relationships identified from the db schema. Choosing override will use the specified relationship in place of any relationships identified from the db schema for that class.

Example:
{"relations": {
  "comments": {               # comments should be name of model or table
    "style": "supplement",
    "relationships": {
       "has_one": "tag"       # has_ons or has_many; tag should model
     }
    }
  }
}


## Benefits

### Relation Detection

The relation detection feature allows for creation of bookshelf models that are already set up with has one and has many relationships whenever they can be detected based on the database structure itself. Allograph's database inspector identifies any table with three columns, two of which are foreign keys, as a junction table. The two tables that are referenced by the foreign keys in the junction tables will each be given Has Many references to each other. 

## Features

### Error Masking

Allograph harnesses the power of 'graphql-errors' to allow you to easily hide details of all errors from the client so you do not inadvertently leak information about your schema. 
In server.js:
```javascript

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

```

Use UserError in a resolve function to create your own custom error message.

```javascript
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
```



### Command Line Tools

'allo server': Start your Allograph server

'allo -h': List of all available commands and options.

'allo generate:graphql': Inspect DB schema and generate GraphQL schema.js file.

'allo migrate': Runs all migrations that have not yet been run.

'allo migrate:rollback': Rolls back the latest migration group.

'allo create:migration <name>': Creates migration file in /migrations folder.
    Optional flag: '-c, --create_table <tableName>'. Creates migration file that for adding a table of the tableName provided. Automatically provides a column for an incrementing primary key; additional columns can be added in the migration file.

