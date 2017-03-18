import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

const Posts = new GraphQLObjectType({
  name: 'Posts',
  description: 'This is a table called posts',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(posts) {
          return posts.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(posts) {
          return posts.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve(posts) {
          return posts.content;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(posts) {
          return posts.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(posts) {
          return posts.updatedAt;
        }
      },
      userId: {
        type: GraphQLInt,
        resolve(posts) {
          return posts.userId;
        }
      },
    };
  }
});

const People = new GraphQLObjectType({
  name: 'People',
  description: 'This is a table called people',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(people) {
          return people.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(people) {
          return people.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(people) {
          return people.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(people) {
          return people.email;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(people) {
          return people.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(people) {
          return people.updatedAt;
        }
      },
    };
  }
});

const Users = new GraphQLObjectType({
  name: 'Users',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(users) {
          return users.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(users) {
          return users.firstName;
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(users) {
          return users.lastName;
        }
      },
      email: {
        type: GraphQLString,
        resolve(users) {
          return users.email;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(users) {
          return users.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(users) {
          return users.updatedAt;
        }
      },
    };
  }
});

const Comments = new GraphQLObjectType({
  name: 'Comments',
  description: 'This is a table called comments',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(comments) {
          return comments.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve(comments) {
          return comments.content;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(comments) {
          return comments.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(comments) {
          return comments.updatedAt;
        }
      },
      userId: {
        type: GraphQLInt,
        resolve(comments) {
          return comments.userId;
        }
      },
      postId: {
        type: GraphQLInt,
        resolve(comments) {
          return comments.postId;
        }
      },
    };
  }
});