import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection');
var jwt = require('jsonwebtoken');

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a table called users',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (user, args, context) {
          return user.id;
        }
      },
      first_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.first_name;
        }
      },
      last_name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.last_name;
        }
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.email;
        }
      },
      projects: {
        type: new GraphQLList(Project),
        resolve (user, args, context) {
          return knex('projects').where({ user_id: user.id });
        }
      },
      users_projects: {
        type: new GraphQLList(Users_project),
        resolve (user, args, context) {
          return knex('users_projects').where({ users_id: user.id });
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
        resolve (tag, args, context) {
          return tag.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (tag, args, context) {
          return tag.title;
        }
      },
      tags_projects: {
        type: new GraphQLList(Tags_project),
        resolve (tag, args, context) {
          return knex('tags_projects').where({ tag_id: tag.id });
        }
      },
    };
  }
});

const Tags_project = new GraphQLObjectType({
  name: 'Tags_project',
  description: 'This is a table called tags_projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (tags_project, args, context) {
          return tags_project.id;
        }
      },
      project_id: {
        type: GraphQLInt,
        resolve (tags_project, args, context) {
          return tags_project.project_id;
        }
      },
      tag_id: {
        type: GraphQLInt,
        resolve (tags_project, args, context) {
          return tags_project.tag_id;
        }
      },
      project: {
        type: Project,
        resolve (tags_project, args, context) {
          return knex('projects').where({ id: tags_project.project_id }).first();
        }
      },
      tag: {
        type: Tag,
        resolve (tags_project, args, context) {
          return knex('tags').where({ id: tags_project.tag_id }).first();
        }
      },
    };
  }
});

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'This is a table called projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (project, args, context) {
          return project.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve (project, args, context) {
          return project.title;
        }
      },
      user_id: {
        type: GraphQLInt,
        resolve (project, args, context) {
          return project.user_id;
        }
      },
      user: {
        type: User,
        resolve (project, args, context) {
          return knex('users').where({ id: project.user_id }).first();
        }
      },
      users_projects: {
        type: new GraphQLList(Users_project),
        resolve (project, args, context) {
          return knex('users_projects').where({ projects_id: project.id });
        }
      },
      tags_projects: {
        type: new GraphQLList(Tags_project),
        resolve (project, args, context) {
          return knex('tags_projects').where({ project_id: project.id });
        }
      },
    };
  }
});

const Users_project = new GraphQLObjectType({
  name: 'Users_project',
  description: 'This is a table called users_projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (users_project, args, context) {
          return users_project.id;
        }
      },
      users_id: {
        type: GraphQLInt,
        resolve (users_project, args, context) {
          return users_project.users_id;
        }
      },
      projects_id: {
        type: GraphQLInt,
        resolve (users_project, args, context) {
          return users_project.projects_id;
        }
      },
      user: {
        type: User,
        resolve (users_project, args, context) {
          return knex('users').where({ id: users_project.users_id }).first();
        }
      },
      project: {
        type: Project,
        resolve (users_project, args, context) {
          return knex('projects').where({ id: users_project.projects_id }).first();
        }
      },
    };
  }
});



export { User, Tag, Tags_project, Project, Users_project }