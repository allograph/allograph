var bookshelf = require('bookshelf')(knex)

var Tag = bookshelf.Model.extend({
  tableName: 'tags',
  posts: function() {
    return this.hasMany(Posts);
  }
  tags_posts: function() {
    return this.hasMany(Tags_posts);
  }
});