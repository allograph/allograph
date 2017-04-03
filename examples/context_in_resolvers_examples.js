// if a user is authenticated, the current login user will be accessible
// through context in every resolver. It can be used for authorization.
// The following is a example.

resolve (parentobj, args, context) {
  var current_user = context.user,
      postClass = new PostClass();

  // find posts that is viewable by current user
  return postClass.posts(args).then(posts => {
    return posts.filter(post => {
      return post.userId === current_user.id;
    });
  });
}