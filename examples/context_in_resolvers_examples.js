// if a user is authenticated, the current login user will be accessible
// through context in every resolver. It can be used for authorization.
// The following is a example.

resolve (root, args, context) {
  var current_user = context.user,
      postClass = new PostClass();

    if (current_user)
      return postClass.posts().then(posts => {
        // filter posts that is created by current user
        return posts.filter(post => {
          return post.userId === current_user.id;
        });
      });
    else {
      return postClass.posts()
    }
  }
}