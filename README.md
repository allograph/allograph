# allograph
```
.
|
├── build
|   └── allo.js           # cli file
├── migration
├── server.js
├── index.js
├── database
|   ├── connection.js
|   └── data.js
├── schema
|   ├── schema.graphql    # generated from schema_translator.js
|   ├── schema.json       # generated from data.js
|   └── users
|       ├── users.js      # implementation of graphql schema in javascript
|       └── users.graphql # graphql schema
├── bookshelf
|   ├── models 
|   |   └── users.js
|   └── bookshelf.js
├── test
├── package.json
├── .gitignore
├── .babelrc
└── README.md
```