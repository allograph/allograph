var bookshelf = require('bookshelf')(knex)

var User = bookshelf.Model.extend({
  tableName: 'users',
  posts: function() {
    return this.hasMany(Posts);
  }
  comments: function() {
    return this.hasMany(Comments);
  }
});