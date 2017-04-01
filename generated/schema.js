import * as models from './models'
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

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      comments: {
        type: new GraphQLList(Comment),
        args: {
          id: {
            type: GraphQLInt
          },
          card_id: {
            type: GraphQLInt
          },
          content: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var comment = new models.Comment()
          return comment.comments(args).then(Comment => {
            return Comment
          });
        }
      },
      labels: {
        type: new GraphQLList(Label),
        args: {
          id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          },
          color: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var label = new models.Label()
          return label.labels(args).then(Label => {
            return Label
          });
        }
      },
      activities: {
        type: new GraphQLList(Activity),
        args: {
          id: {
            type: GraphQLInt
          },
          card_id: {
            type: GraphQLInt
          },
          card_id_source: {
            type: GraphQLInt
          },
          comment_id: {
            type: GraphQLInt
          },
          list_id_source: {
            type: GraphQLInt
          },
          list_id_dest: {
            type: GraphQLInt
          },
          action: {
            type: GraphQLString
          },
          actionable_item: {
            type: GraphQLString
          },
          due_date: {
            type: GraphQLString
          },
          date: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          return activity.activities(args).then(Activity => {
            return Activity
          });
        }
      },
      card_labels: {
        type: new GraphQLList(Card_label),
        args: {
          id: {
            type: GraphQLInt
          },
          card_id: {
            type: GraphQLInt
          },
          label_id: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          var card_label = new models.Card_label()
          return card_label.card_labels(args).then(Card_label => {
            return Card_label
          });
        }
      },
      lists: {
        type: new GraphQLList(List),
        args: {
          id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          },
          position: {
            type: GraphQLInt
          }
        },
        resolve (root, args) {
          var list = new models.List()
          return list.lists(args).then(List => {
            return List
          });
        }
      },
      notifications: {
        type: new GraphQLList(Notification),
        args: {
          id: {
            type: GraphQLInt
          },
          activity_id: {
            type: GraphQLInt
          },
          seen: {
            type: GraphQLBoolean
          }
        },
        resolve (root, args) {
          var notification = new models.Notification()
          return notification.notifications(args).then(Notification => {
            return Notification
          });
        }
      },
      cards: {
        type: new GraphQLList(Card),
        args: {
          id: {
            type: GraphQLInt
          },
          list_id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          },
          description: {
            type: GraphQLString
          },
          due_date: {
            type: GraphQLString
          },
          position: {
            type: GraphQLInt
          },
          subscriber: {
            type: GraphQLBoolean
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          return card.cards(args).then(Card => {
            return Card
          });
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to set stuff',
  fields () {
    return {
      addComment: {
        type: Comment,
        args: {
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var comment = new models.Comment()
          comment.createComment(args).then(comment => {
            return comment[0];
          });
        }
      },
      updateComment: {
        type: Comment,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var comment = new models.Comment()
          comment.updateComment(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteComment: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var comment = new models.Comment()
          comment.deleteComment(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addLabel: {
        type: Label,
        args: {
          name: {
            type: GraphQLString
          },
          color: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var label = new models.Label()
          label.createLabel(args).then(label => {
            return label[0];
          });
        }
      },
      updateLabel: {
        type: Label,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          name: {
            type: GraphQLString
          },
          color: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var label = new models.Label()
          label.updateLabel(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteLabel: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var label = new models.Label()
          label.deleteLabel(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addActivity: {
        type: Activity,
        args: {
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          card_id_source: {
            type: GraphQLInt
          },
          comment_id: {
            type: GraphQLInt
          },
          list_id_source: {
            type: GraphQLInt
          },
          list_id_dest: {
            type: GraphQLInt
          },
          action: {
            type: new GraphQLNonNull(GraphQLString)
          },
          actionable_item: {
            type: new GraphQLNonNull(GraphQLString)
          },
          due_date: {
            type: GraphQLString
          },
          date: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          activity.createActivity(args).then(activity => {
            return activity[0];
          });
        }
      },
      updateActivity: {
        type: Activity,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          card_id_source: {
            type: GraphQLInt
          },
          comment_id: {
            type: GraphQLInt
          },
          list_id_source: {
            type: GraphQLInt
          },
          list_id_dest: {
            type: GraphQLInt
          },
          action: {
            type: new GraphQLNonNull(GraphQLString)
          },
          actionable_item: {
            type: new GraphQLNonNull(GraphQLString)
          },
          due_date: {
            type: GraphQLString
          },
          date: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          activity.updateActivity(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteActivity: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          activity.deleteActivity(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addCard_label: {
        type: Card_label,
        args: {
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          label_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var card_label = new models.Card_label()
          card_label.createCard_label(args).then(card_label => {
            return card_label[0];
          });
        }
      },
      updateCard_label: {
        type: Card_label,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          card_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          label_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var card_label = new models.Card_label()
          card_label.updateCard_label(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteCard_label: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var card_label = new models.Card_label()
          card_label.deleteCard_label(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addList: {
        type: List,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var list = new models.List()
          list.createList(args).then(list => {
            return list[0];
          });
        }
      },
      updateList: {
        type: List,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var list = new models.List()
          list.updateList(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteList: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var list = new models.List()
          list.deleteList(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addNotification: {
        type: Notification,
        args: {
          activity_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          seen: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var notification = new models.Notification()
          notification.createNotification(args).then(notification => {
            return notification[0];
          });
        }
      },
      updateNotification: {
        type: Notification,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          activity_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          seen: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var notification = new models.Notification()
          notification.updateNotification(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteNotification: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var notification = new models.Notification()
          notification.deleteNotification(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      },
      addCard: {
        type: Card,
        args: {
          list_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: GraphQLString
          },
          due_date: {
            type: GraphQLString
          },
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          subscriber: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          card.createCard(args).then(card => {
            return card[0];
          });
        }
      },
      updateCard: {
        type: Card,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          list_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: GraphQLString
          },
          due_date: {
            type: GraphQLString
          },
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          subscriber: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          card.updateCard(args).then(activity => {
            return activity[0];
          });
        }
      },
      deleteCard: {
        type: GraphQLString,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          card.deleteCard(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      }
    };
  }
});exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});