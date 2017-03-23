var knex = require('./db_connection')
var fs = require('fs');
var bookshelf = require('bookshelf')(knex);

var Bookshelf = function () {};

Bookshelf.prototype.createUserModel = function(meta) {
  for (var property in meta.tables) {
    if (meta.tables.hasOwnProperty(property)) {
      var fileName = __dirname + '/models/' + property + '.js'
      console.log(fileName)
      var data = 'Model Name' + meta.tables[property]
      fs.writeFileSync(fileName, data, 'utf-8');
    }
  }
}

exports.Bookshelf = new Bookshelf();