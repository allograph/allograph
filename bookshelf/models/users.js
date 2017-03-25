var bookshelf = require('bookshelf')(knex)

var User = bookshelf.Model.extend({
  tableName: 'users',
});