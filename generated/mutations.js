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
          return comment.createComment(args);
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
          return comment.updateComment(args);
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
          return comment.deleteComment(args);
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
          return label.createLabel(args);
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
          return label.updateLabel(args);
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
          return label.deleteLabel(args);
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
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          return activity.createActivity(args);
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
          }
        },
        resolve (root, args) {
          var activity = new models.Activity()
          return activity.updateActivity(args);
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
          return activity.deleteActivity(args);
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
          return card_label.createCard_label(args);
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
          return card_label.updateCard_label(args);
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
          return card_label.deleteCard_label(args);
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
          return list.createList(args);
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
          return list.updateList(args);
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
          return list.deleteList(args);
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
          return notification.createNotification(args);
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
          return notification.updateNotification(args);
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
          return notification.deleteNotification(args);
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
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          subscriber: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          return card.createCard(args);
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
          position: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          subscriber: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve (root, args) {
          var card = new models.Card()
          return card.updateCard(args);
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
          return card.deleteCard(args);
        }
      }
    };
  }
});