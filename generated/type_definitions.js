import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection'),
    jwt = require('jsonwebtoken');

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
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (user, args, context) {
          return user.first_name;
        }
      },
      lastName: {
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
        resolve (User, args, context) {
          return knex('projects').where({ user_id: User.id });
        }
      },
      users_projects: {
        type: new GraphQLList(UsersProject),
        resolve (User, args, context) {
          return knex('users_projects').where({ users_id: User.id });
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
        type: new GraphQLList(TagsProject),
        resolve (Tag, args, context) {
          return knex('tags_projects').where({ tag_id: Tag.id });
        }
      },
    };
  }
});

const TagsProject = new GraphQLObjectType({
  name: 'TagsProject',
  description: 'This is a table called tags_projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (tags_project, args, context) {
          return tags_project.id;
        }
      },
      projectId: {
        type: GraphQLInt,
        resolve (tags_project, args, context) {
          return tags_project.project_id;
        }
      },
      tagId: {
        type: GraphQLInt,
        resolve (tags_project, args, context) {
          return tags_project.tag_id;
        }
      },
      project: {
        type: Project,
        resolve (TagsProject, args, context) {
          return knex('projects').where({ id: TagsProject.project_id }).first();
        }
      },
      tag: {
        type: Tag,
        resolve (TagsProject, args, context) {
          return knex('tags').where({ id: TagsProject.tag_id }).first();
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
      userId: {
        type: GraphQLInt,
        resolve (project, args, context) {
          return project.user_id;
        }
      },
      user: {
        type: User,
        resolve (Project, args, context) {
          return knex('users').where({ id: Project.user_id }).first();
        }
      },
      users_projects: {
        type: new GraphQLList(UsersProject),
        resolve (Project, args, context) {
          return knex('users_projects').where({ projects_id: Project.id });
        }
      },
      tags_projects: {
        type: new GraphQLList(TagsProject),
        resolve (Project, args, context) {
          return knex('tags_projects').where({ project_id: Project.id });
        }
      },
    };
  }
});

const UsersProject = new GraphQLObjectType({
  name: 'UsersProject',
  description: 'This is a table called users_projects',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (users_project, args, context) {
          return users_project.id;
        }
      },
      usersId: {
        type: GraphQLInt,
        resolve (users_project, args, context) {
          return users_project.users_id;
        }
      },
      projectsId: {
        type: GraphQLInt,
        resolve (users_project, args, context) {
          return users_project.projects_id;
        }
      },
      user: {
        type: User,
        resolve (UsersProject, args, context) {
          return knex('users').where({ id: UsersProject.users_id }).first();
        }
      },
      project: {
        type: Project,
        resolve (UsersProject, args, context) {
          return knex('projects').where({ id: UsersProject.projects_id }).first();
        }
      },
    };
  }
});

export { User, Tag, TagsProject, Project, UsersProject }