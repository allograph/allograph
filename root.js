import {
  Address,
  Review,
  Book,
  User,
  Users_book
} from './schema/models.js'

var root = {

addresses: function (args) {
    var address = new Address;
    console.log(args)
    return address.addresses(args);
  },
  addAddress: function(args) {
    var address = new Address;
    return address.createAddress(args);
  },
  updateAddress: function(args) {
    var address = new Address;
    return address.updateAddress(args);
  },
  deleteAddress: function({id}) {
    var address = new Address;
    return address.deleteAddress(id);
  },

reviews: function (args) {
    var review = new Review;
    return review.reviews(args);
  },
  addReview: function(args) {
    var review = new Review;
    return review.createReview(args);
  },
  updateReview: function(args) {
    var review = new Review;
    return review.updateReview(args);
  },
  deleteReview: function({id}) {
    var review = new Review;
    return review.deleteReview(id);
  },

books: function (args) {
    var book = new Book;
    return book.books(args);
  },
  addBook: function(args) {
    var book = new Book;
    return book.createBook(args);
  },
  updateBook: function(args) {
    var book = new Book;
    return book.updateBook(args);
  },
  deleteBook: function({id}) {
    var book = new Book;
    return book.deleteBook(id);
  },

users: function (args) {
    var user = new User;
    return user.users(args);
  },
  addUser: function(args) {
    var user = new User;
    return user.createUser(args);
  },
  updateUser: function(args) {
    var user = new User;
    return user.updateUser(args);
  },
  deleteUser: function({id}) {
    var user = new User;
    return user.deleteUser(id);
  },

users_books: function (args) {
    var users_book = new Users_book;
    return users_book.users_books(args);
  },
  addUsers_book: function(args) {
    var users_book = new Users_book;
    return users_book.createUsers_book(args);
  },
  updateUsers_book: function(args) {
    var users_book = new Users_book;
    return users_book.updateUsers_book(args);
  },
  deleteUsers_book: function({id}) {
    var users_book = new Users_book;
    return users_book.deleteUsers_book(id);
  }
};

module.exports = root;