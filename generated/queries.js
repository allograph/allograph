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

