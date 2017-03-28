import {
  User,
  Comment,
  Post,
  Tag,
  Tags_post,
} from './schema/models.js'

var root = {

  users: function (args) {
      var user = new User;
      return user.users(args);
    },
    addUser: function(args) {
      var user = new User;
      return user.createUser(args);
    },
    updateUser: function(args) {
      var user = new User;
      return user.updateUser(args);
    },
    deleteUser: function({id}) {
      var user = new User;
      return user.deleteUser(id);
    }

  comments: function (args) {
      var comment = new Comment;
      return comment.comments(args);
    },
    addComment: function(args) {
      var comment = new Comment;
      return comment.createComment(args);
    },
    updateComment: function(args) {
      var comment = new Comment;
      return comment.updateComment(args);
    },
    deleteComment: function({id}) {
      var comment = new Comment;
      return comment.deleteComment(id);
    }

  posts: function (args) {
      var post = new Post;
      return post.posts(args);
    },
    addPost: function(args) {
      var post = new Post;
      return post.createPost(args);
    },
    updatePost: function(args) {
      var post = new Post;
      return post.updatePost(args);
    },
    deletePost: function({id}) {
      var post = new Post;
      return post.deletePost(id);
    }

  tags: function (args) {
      var tag = new Tag;
      return tag.tags(args);
    },
    addTag: function(args) {
      var tag = new Tag;
      return tag.createTag(args);
    },
    updateTag: function(args) {
      var tag = new Tag;
      return tag.updateTag(args);
    },
    deleteTag: function({id}) {
      var tag = new Tag;
      return tag.deleteTag(id);
    }

  tags_posts: function (args) {
      var tags_post = new Tags_post;
      return tags_post.tags_posts(args);
    },
    addTags_post: function(args) {
      var tags_post = new Tags_post;
      return tags_post.createTags_post(args);
    },
    updateTags_post: function(args) {
      var tags_post = new Tags_post;
      return tags_post.updateTags_post(args);
    },
    deleteTags_post: function({id}) {
      var tags_post = new Tags_post;
      return tags_post.deleteTags_post(id);
    }
  }
};

module.exports = root;