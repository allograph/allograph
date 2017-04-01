import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

var knex = require('../database/connection')

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This is a table called comment',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (comment) {
          return comment.id;
        }
      },
      card_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (comment) {
          return comment.card_id;
        }
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (comment) {
          return comment.content;
        }
      },
      activity: {
        type: new GraphQLList(Activity),
        resolve (comment) {
          return knex('activity').where({ comment_id: comment.id }).then(activity => {;
            return activity;
          });
        }
      },
      card: {
        type: Card,
        resolve (comment) {
          return knex('card').where({ id: comment.card_id }).then(card => {;
            return card[0];
          });
        }
      },
    };
  }
});

const Label = new GraphQLObjectType({
  name: 'Label',
  description: 'This is a table called label',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (label) {
          return label.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (label) {
          return label.name;
        }
      },
      color: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (label) {
          return label.color;
        }
      },
      card_label: {
        type: new GraphQLList(Card_label),
        resolve (label) {
          return knex('card_label').where({ label_id: label.id }).then(card_label => {;
            return card_label;
          });
        }
      },
    };
  }
});

const Activity = new GraphQLObjectType({
  name: 'Activity',
  description: 'This is a table called activity',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (activity) {
          return activity.id;
        }
      },
      card_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (activity) {
          return activity.card_id;
        }
      },
      card_id_source: {
        type: GraphQLInt,
        resolve (activity) {
          return activity.card_id_source;
        }
      },
      comment_id: {
        type: GraphQLInt,
        resolve (activity) {
          return activity.comment_id;
        }
      },
      list_id_source: {
        type: GraphQLInt,
        resolve (activity) {
          return activity.list_id_source;
        }
      },
      list_id_dest: {
        type: GraphQLInt,
        resolve (activity) {
          return activity.list_id_dest;
        }
      },
      action: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (activity) {
          return activity.action;
        }
      },
      actionable_item: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (activity) {
          return activity.actionable_item;
        }
      },
      due_date: {
        type: GraphQLString,
        resolve (activity) {
          return activity.due_date;
        }
      },
      date: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (activity) {
          return activity.date;
        }
      },
      card: {
        type: Card,
        resolve (activity) {
          return knex('card').where({ id: activity.card_id_source }).then(card => {;
            return card[0];
          });
        }
      },
      comment: {
        type: Comment,
        resolve (activity) {
          return knex('comment').where({ id: activity.comment_id }).then(comment => {;
            return comment[0];
          });
        }
      },
      list: {
        type: List,
        resolve (activity) {
          return knex('list').where({ id: activity.list_id_source }).then(list => {;
            return list[0];
          });
        }
      },
      notification: {
        type: new GraphQLList(Notification),
        resolve (activity) {
          return knex('notification').where({ activity_id: activity.id }).then(notification => {;
            return notification;
          });
        }
      },
    };
  }
});

const Card_label = new GraphQLObjectType({
  name: 'Card_label',
  description: 'This is a table called card_label',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card_label) {
          return card_label.id;
        }
      },
      card_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card_label) {
          return card_label.card_id;
        }
      },
      label_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card_label) {
          return card_label.label_id;
        }
      },
      card: {
        type: Card,
        resolve (card_label) {
          return knex('card').where({ id: card_label.card_id }).then(card => {;
            return card[0];
          });
        }
      },
      label: {
        type: Label,
        resolve (card_label) {
          return knex('label').where({ id: card_label.label_id }).then(label => {;
            return label[0];
          });
        }
      },
    };
  }
});

const List = new GraphQLObjectType({
  name: 'List',
  description: 'This is a table called list',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (list) {
          return list.id;
        }
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (list) {
          return list.name;
        }
      },
      position: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (list) {
          return list.position;
        }
      },
      activity: {
        type: new GraphQLList(Activity),
        resolve (list) {
          return knex('activity').where({ list_id_source: list.id }).then(activity => {;
            return activity;
          });
        }
      },
      card: {
        type: new GraphQLList(Card),
        resolve (list) {
          return knex('card').where({ list_id: list.id }).then(card => {;
            return card;
          });
        }
      },
    };
  }
});

const Notification = new GraphQLObjectType({
  name: 'Notification',
  description: 'This is a table called notification',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (notification) {
          return notification.id;
        }
      },
      activity_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (notification) {
          return notification.activity_id;
        }
      },
      seen: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve (notification) {
          return notification.seen;
        }
      },
      activity: {
        type: Activity,
        resolve (notification) {
          return knex('activity').where({ id: notification.activity_id }).then(activity => {;
            return activity[0];
          });
        }
      },
    };
  }
});

const Card = new GraphQLObjectType({
  name: 'Card',
  description: 'This is a table called card',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card) {
          return card.id;
        }
      },
      list_id: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card) {
          return card.list_id;
        }
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve (card) {
          return card.name;
        }
      },
      description: {
        type: GraphQLString,
        resolve (card) {
          return card.description;
        }
      },
      due_date: {
        type: GraphQLString,
        resolve (card) {
          return card.due_date;
        }
      },
      position: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve (card) {
          return card.position;
        }
      },
      subscriber: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve (card) {
          return card.subscriber;
        }
      },
      activity: {
        type: new GraphQLList(Activity),
        resolve (card) {
          return knex('activity').where({ card_id_source: card.id }).then(activity => {;
            return activity;
          });
        }
      },
      card_label: {
        type: new GraphQLList(Card_label),
        resolve (card) {
          return knex('card_label').where({ card_id: card.id }).then(card_label => {;
            return card_label;
          });
        }
      },
      list: {
        type: List,
        resolve (card) {
          return knex('list').where({ id: card.list_id }).then(list => {;
            return list[0];
          });
        }
      },
      comment: {
        type: new GraphQLList(Comment),
        resolve (card) {
          return knex('comment').where({ card_id: card.id }).then(comment => {;
            return comment;
          });
        }
      },
    };
  }
});



export { Comment, Label, Activity, Card_label, List, Notification, Card }