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
          var comment = new CommentClass()
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
          var comment = new CommentClass()
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
          var comment = new CommentClass()
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
          var label = new LabelClass()
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
          var label = new LabelClass()
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
          var label = new LabelClass()
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
          var activity = new ActivityClass()
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
          var activity = new ActivityClass()
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
          var activity = new ActivityClass()
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
          var card_label = new Card_labelClass()
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
          var card_label = new Card_labelClass()
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
          var card_label = new Card_labelClass()
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
          var list = new ListClass()
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
          var list = new ListClass()
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
          var list = new ListClass()
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
          var notification = new NotificationClass()
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
          var notification = new NotificationClass()
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
          var notification = new NotificationClass()
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
          var card = new CardClass()
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
          var card = new CardClass()
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
          var card = new CardClass()
          card.deleteCard(args).then(numberOfDeletedItems => {
            return 'Number of deleted activity: ' + numberOfDeletedItems;
          });
        }
      }
    };
  }
});