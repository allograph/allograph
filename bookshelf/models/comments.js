var bookshelf = require('bookshelf')(knex)

var Comment = bookshelf.Model.extend({
  tableName: 'comments',
  user: function() {
    return this.hasOne(User);
  }
  post: function() {
    return this.hasOne(Post);
  }
});