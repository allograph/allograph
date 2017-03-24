var bookshelf = require('bookshelf')(knex)

var Post = bookshelf.Model.extend({
  tableName: 'posts',
  tags_posts: function() {
    return this.hasMany(Tags_posts);
  }
  comments: function() {
    return this.hasMany(Comments);
  }
  tags: function() {
    return this.hasMany(Tags);
  }
  user: function() {
    return this.hasOne(User);
  }
});