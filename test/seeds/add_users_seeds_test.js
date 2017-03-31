exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function() { 
      return knex('users').insert({
        full_name: 'Micah Matthews',
        email: 'mm@example.com',
      });
    }).then(function () {
      return knex('users').insert({
        full_name: 'Penelope Fitzgerald',
        email: 'pfitzgerald@usa.com',
      });
    }).then(function () {
      return knex('users').insert({
        full_name: 'Polly Parker',
        email: 'polly@suits.com',
      });
    }).then(function () {
      return knex('users').insert({
        full_name: 'Suzie Simpson',
        email: 'suzie_rocks@fakegmail.com',
      });
    });
};