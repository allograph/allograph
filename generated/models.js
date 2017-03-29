// This file is generated by Allograph. We recommend that you do not modify this file.
var knex = require('../database/connection');

module.exports = class User {
  users(args) {
    return knex('users').where(args).then(users => {
      return users
    });
  }

  createUser(args) {
    return knex.returning('id').insert({
      id: args.id,
      first_name: args.first_name,
      last_name: args.last_name,
      email: args.email,
    }).into('users').then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  updateUser(args) {
    return knex('users').where({ id: args.id }).returning('id').update({
      id: args.id,
      first_name: args.first_name,
      last_name: args.last_name,
      email: args.email,
    }).then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  deleteUser(id) {
    return knex('users').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted users: ' + numberOfDeletedItems;
    });
  }
}

module.exports = class Project {
  projects(args) {
    return knex('projects').where(args).then(projects => {
      return projects
    });
  }

  createProject(args) {
    return knex.returning('id').insert({
      id: args.id,
      title: args.title,
      user_id: args.user_id,
    }).into('projects').then(id => {
      return knex('projects').where({ id: id[0] }).then(project => {
        return project[0];
      });
    });
  }

  updateProject(args) {
    return knex('projects').where({ id: args.id }).returning('id').update({
      id: args.id,
      title: args.title,
    }).then(id => {
      return knex('projects').where({ id: id[0] }).then(project => {
        return project[0];
      });
    });
  }

  deleteProject(id) {
    return knex('projects').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted projects: ' + numberOfDeletedItems;
    });
  }
}