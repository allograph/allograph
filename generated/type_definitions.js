import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (user) {
          return user.id;
        }
      },
      first_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user) {
          return user.first_name;
        }
      },
      last_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user) {
          return user.last_name;
        }
      },
      email: {
        type: GraphQLString,
        resolve (user) {
          return user.email;
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (user) {
          return knex('comments').where({ userId: user.id }).then(comments => {;
            return comments;
          });
        }
      },
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comments',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (comment) {
          return comment.id;
        }
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (comment) {
          return comment.content;
        }
      },
      users: {
        type: User,
        resolve (comment) {
          return knex('users').where({ id: comment.userId }).then(users => {;
            return users[0];
          });
        }
      },
      posts: {
        type: Post,
        resolve (comment) {
          return knex('posts').where({ id: comment.postId }).then(posts => {;
            return posts[0];
          });
        }
      },
    };
  }
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a table called posts',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (post) {
          return post.id;
        }
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (post) {
          return post.title;
        }
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (post) {
          return post.content;
        }
      },
      tags_posts: {
        type: new GraphQLList(Tags_post),
        resolve (post) {
          return knex('tags_posts').where({ post_id: post.id }).then(tags_posts => {;
            return tags_posts;
          });
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (post) {
          return knex('comments').where({ postId: post.id }).then(comments => {;
            return comments;
          });
        }
      },
    };
  }
});

const Tag = new GraphQLObjectType({
  name: 'Tag',
  description: 'This is a table called tags',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (tag) {
          return tag.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (tag) {
          return tag.title;
        }
      },
      tags_posts: {
        type: new GraphQLList(Tags_post),
        resolve (tag) {
          return knex('tags_posts').where({ tag_id: tag.id }).then(tags_posts => {;
            return tags_posts;
          });
        }
      },
    };
  }
});

const Tags_post = new GraphQLObjectType({
  name: 'Tags_post',
  description: 'This is a table called tags_posts',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (tags_post) {
          return tags_post.id;
        }
      },
      posts: {
        type: Post,
        resolve (tags_post) {
          return knex('posts').where({ id: tags_post.post_id }).then(posts => {;
            return posts[0];
          });
        }
      },
      tags: {
        type: Tag,
        resolve (tags_post) {
          return knex('tags').where({ id: tags_post.tag_id }).then(tags => {;
            return tags[0];
          });
        }
      },
    };
  }
});