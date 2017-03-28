// This file is generated by Allograph. We recommend that you do not modify this file.
var knex = require('../database/connection');

export class Address {
  addresses(args) {
    console.log(args)
    return knex('addresses').where(args).then(addresses => {
      return addresses
    });
  }

  createAddress(args) {
    return knex.returning('id').insert({
      street: args.street,
      city: args.city,
      state: args.state,
      users: args.users,
    }).into('addresses').then(id => {
      return knex('addresses').where({ id: id[0] }).then(address => {
        return address[0];
      });
    });
  }

  updateAddress(args) {
    return knex('addresses').where({ id: args.id }).returning('id').update({
      street: args.street,
      city: args.city,
      state: args.state,
      users: args.users,
    }).then(id => {
      return knex('addresses').where({ id: id[0] }).then(address => {
        return address[0];
      });
    });
  }

  deleteAddress(id) {
    return knex('addresses').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted addresses: ' + numberOfDeletedItems;
    });
  }
}

export class Review {
  reviews(args) {
    return knex('reviews').where(args).then(reviews => {
      return reviews
    });
  }

  createReview(args) {
    return knex.returning('id').insert({
      id: args.id,
      review_content: args.review_content,
      rating: args.rating,
      published_date: args.published_date,
      books: args.books,
      users: args.users,
    }).into('reviews').then(id => {
      return knex('reviews').where({ id: id[0] }).then(review => {
        return review[0];
      });
    });
  }

  updateReview(args) {
    return knex('reviews').where({ id: args.id }).returning('id').update({
      id: args.id,
      review_content: args.review_content,
      rating: args.rating,
      published_date: args.published_date,
      books: args.books,
      users: args.users,
    }).then(id => {
      return knex('reviews').where({ id: id[0] }).then(review => {
        return review[0];
      });
    });
  }

  deleteReview(id) {
    return knex('reviews').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted reviews: ' + numberOfDeletedItems;
    });
  }
}

export class Book {
  books(args) {
    return knex('books').where(args).then(books => {
      return books
    });
  }

  createBook(args) {
    return knex.returning('id').insert({
      id: args.id,
      title: args.title,
      author: args.author,
      published_date: args.published_date,
      isbn: args.isbn,
      reviews: args.reviews,
      users_books: args.users_books,
    }).into('books').then(id => {
      return knex('books').where({ id: id[0] }).then(book => {
        return book[0];
      });
    });
  }

  updateBook(args) {
    return knex('books').where({ id: args.id }).returning('id').update({
      id: args.id,
      title: args.title,
      author: args.author,
      published_date: args.published_date,
      isbn: args.isbn,
      reviews: args.reviews,
      users_books: args.users_books,
    }).then(id => {
      return knex('books').where({ id: id[0] }).then(book => {
        return book[0];
      });
    });
  }

  deleteBook(id) {
    return knex('books').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted books: ' + numberOfDeletedItems;
    });
  }
}

export class User {
  users(args) {
    return knex('users').where(args).then(users => {
      return users
    });
  }

  createUser(args) {
    return knex.returning('id').insert({
      id: args.id,
      username: args.username,
      enabled: args.enabled,
      last_login: args.last_login,
      addresses: args.addresses,
      reviews: args.reviews,
      users_books: args.users_books,
    }).into('users').then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  updateUser(args) {
    return knex('users').where({ id: args.id }).returning('id').update({
      id: args.id,
      username: args.username,
      enabled: args.enabled,
      last_login: args.last_login,
      addresses: args.addresses,
      reviews: args.reviews,
      users_books: args.users_books,
    }).then(id => {
      return knex('users').where({ id: id[0] }).then(user => {
        return user[0];
      });
    });
  }

  deleteUser(id) {
    return knex('users').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted users: ' + numberOfDeletedItems;
    });
  }
}

export class Users_book {
  users_books(args) {
    return knex('users_books').where(args).then(users_books => {
      return users_books
    });
  }

  createUsers_book(args) {
    return knex.returning('id').insert({
      checkout_date: args.checkout_date,
      return_date: args.return_date,
      books: args.books,
      users: args.users,
    }).into('users_books').then(id => {
      return knex('users_books').where({ id: id[0] }).then(users_book => {
        return users_book[0];
      });
    });
  }

  updateUsers_book(args) {
    return knex('users_books').where({ id: args.id }).returning('id').update({
      checkout_date: args.checkout_date,
      return_date: args.return_date,
      books: args.books,
      users: args.users,
    }).then(id => {
      return knex('users_books').where({ id: id[0] }).then(users_book => {
        return users_book[0];
      });
    });
  }

  deleteUsers_book(id) {
    return knex('users_books').where({ id: id }).del().then(numberOfDeletedItems => {
      return 'Number of deleted users_books: ' + numberOfDeletedItems;
    });
  }
}