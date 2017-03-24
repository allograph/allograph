var bookshelf = require('bookshelf')(knex)

var Tags_post = bookshelf.Model.extend({
  tableName: 'tags_posts',
  post: function() {
    return this.hasOne(Post);
  }
  tag: function() {
    return this.hasOne(Tag);
  }
});