import { BaseComment } from '../../generated/models'
var knex = require('../../database/connection');

export class Comment extends BaseComment {
  comments(args) {
    if (args.limit) {
      return knex('comment').limit(args.limit);
    } else {
      return knex('comment').where(args);
    }
  }
}