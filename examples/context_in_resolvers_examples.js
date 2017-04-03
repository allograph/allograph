// if a user is authenticated, the current login user will be accessible
// through context in every resolver. It can be used for authorization.
// The following is a example.

resolve (parentobj, args, context) {
  var current_user = context.user,
      postClass = new postClass();

  // find posts that is viewable by current user
  return postClass.posts().then(posts => {
    posts.filter((post) => {
      return postViewableBy(current_user.id);
    });
  });
}