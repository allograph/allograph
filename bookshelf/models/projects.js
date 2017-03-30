var bookshelf = require('bookshelf')(knex)

var Project = bookshelf.Model.extend({
  tableName: 'projects',
});