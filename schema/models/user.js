import { BaseUser } from '../../generated/models'
var knex = require('../../database/connection');

export class User extends BaseUser {
  userProjects(args) {
    return knex.select('*').from('projects').leftJoin('users_projects', 'projects.id', 'users_projects.projects_id').where({ 
      users_id: args.id 
    });
  }
}