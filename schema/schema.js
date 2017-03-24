import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection')

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (user) {
          return user.id;
        }
      },
      first_name: {
        type: GraphQLString,
        resolve (user) {
          return user.first_name;
        }
      },
      last_name: {
        type: GraphQLString,
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
      posts: {
        type: new GraphQLList(Post),
        resolve (user) {
          return knex('posts').where({ userId: user.id }).then(posts => {;
            return posts;
          })
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (user) {
          return knex('comments').where({ userId: user.id }).then(comments => {;
            return comments;
          })
        }
      },
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comments',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (comment) {
          return comment.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve (comment) {
          return comment.content;
        }
      },
      users: {
        type: User,
        resolve (comment) {
          return knex('users').where({ id: comment.userId }).then(users => {;
            return users[0];
          })
        }
      },
      posts: {
        type: Post,
        resolve (comment) {
          return knex('posts').where({ id: comment.postId }).then(posts => {;
            return posts[0];
          })
        }
      },
    };
  }
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a table called posts',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (post) {
          return post.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (post) {
          return post.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve (post) {
          return post.content;
        }
      },
      users: {
        type: User,
        resolve (post) {
          return knex('users').where({ id: post.userId }).then(users => {;
            return users[0];
          })
        }
      },
      tags_posts: {
        type: new GraphQLList(Tags_post),
        resolve (post) {
          return knex('tags_posts').where({ post_id: post.id }).then(tags_posts => {;
            return tags_posts;
          })
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (post) {
          return knex('comments').where({ postId: post.id }).then(comments => {;
            return comments;
          })
        }
      },
    };
  }
});

const Tag = new GraphQLObjectType({
  name: 'Tag',
  description: 'This is a table called tags',
  fields () {
    return {
      id: {
        type: GraphQLInt,
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
          })
        }
      },
    };
  }
});

const Tags_post = new GraphQLObjectType({
  name: 'Tags_post',
  description: 'This is a table called tags_posts',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (tags_post) {
          return tags_post.id;
        }
      },
      posts: {
        type: Post,
        resolve (tags_post) {
          return knex('posts').where({ id: tags_post.post_id }).then(posts => {;
            return posts[0];
          })
        }
      },
      tags: {
        type: Tag,
        resolve (tags_post) {
          return knex('tags').where({ id: tags_post.tag_id }).then(tags => {;
            return tags[0];
          })
        }
      },
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      users: {
        type: new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          },
          first_name: {
            type: GraphQLString
          },
          last_name: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('users').where(args)
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        args: {
          id: {
            type: GraphQLInt
          },
          content: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('comments').where(args)
        }
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('posts').where(args)
        }
      },
      tags: {
        type: new GraphQLList(Tag),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return knex('tags').where(args)
        }
      },
      tags_posts: {
        type: new GraphQLList(Tags_post),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          return knex('tags_posts').where(args)
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      addUser: {
        type: User,
        args: {
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
          }).into('users').then(id => {
            return knex('users').where({ id: id[0] }).then(user => {
              return user[0];
            });
          });
        }
      },
      updateUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex('users').where({ id: args.id }).returning('id').update({
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
          }).then(id => {
            return knex('users').where({ id: id[0] }).then(user => {
              return user[0];
            });
          });
        }
      },
      deleteUser: {
        type: User,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('users').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted users: ' + numberOfDeletedItems);
          });
        }
      },
      addComment: {
        type: Comment,
        args: {
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          postId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            content: args.content,
            userId: args.userId,
            postId: args.postId,
          }).into('comments').then(id => {
            return knex('comments').where({ id: id[0] }).then(comment => {
              return comment[0];
            });
          });
        }
      },
      updateComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return knex('comments').where({ id: args.id }).returning('id').update({
            content: args.content,
          }).then(id => {
            return knex('comments').where({ id: id[0] }).then(comment => {
              return comment[0];
            });
          });
        }
      },
      deleteComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('comments').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted comments: ' + numberOfDeletedItems);
          });
        }
      },
      addPost: {
        type: Post,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          userId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            title: args.title,
            content: args.content,
            userId: args.userId,
          }).into('posts').then(id => {
            return knex('posts').where({ id: id[0] }).then(post => {
              return post[0];
            });
          });
        }
      },
      updatePost: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return knex('posts').where({ id: args.id }).returning('id').update({
            title: args.title,
            content: args.content,
          }).then(id => {
            return knex('posts').where({ id: id[0] }).then(post => {
              return post[0];
            });
          });
        }
      },
      deletePost: {
        type: Post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('posts').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted posts: ' + numberOfDeletedItems);
          });
        }
      },
      addTag: {
        type: Tag,
        args: {
          title: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            title: args.title,
          }).into('tags').then(id => {
            return knex('tags').where({ id: id[0] }).then(tag => {
              return tag[0];
            });
          });
        }
      },
      updateTag: {
        type: Tag,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (source, args) {
          return knex('tags').where({ id: args.id }).returning('id').update({
            title: args.title,
          }).then(id => {
            return knex('tags').where({ id: id[0] }).then(tag => {
              return tag[0];
            });
          });
        }
      },
      deleteTag: {
        type: Tag,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('tags').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted tags: ' + numberOfDeletedItems);
          });
        }
      },
      addTags_post: {
        type: Tags_post,
        args: {
          post_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          tag_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex.returning('id').insert({
            post_id: args.post_id,
            tag_id: args.tag_id,
          }).into('tags_posts').then(id => {
            return knex('tags_posts').where({ id: id[0] }).then(tags_post => {
              return tags_post[0];
            });
          });
        }
      },
      updateTags_post: {
        type: Tags_post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          return knex('tags_posts').where({ id: args.id }).returning('id').update({
          }).then(id => {
            return knex('tags_posts').where({ id: id[0] }).then(tags_post => {
              return tags_post[0];
            });
          });
        }
      },
      deleteTags_post: {
        type: Tags_post,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (source, args) {
          knex('tags_posts').where({ id: args.id }).del().then(numberOfDeletedItems => {
            console.log('Number of deleted tags_posts: ' + numberOfDeletedItems);
          });
        }
      }
    };
  }
});

exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});