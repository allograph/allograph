var knex = require('../database/connection');
var fs = require('fs');
var bookshelf = require('bookshelf')(knex);
var lingo = require('lingo');

var Bookshelf = function () {};

Bookshelf.prototype.createUserModels = function(meta) {  // Need to rename this function!
  for (var property in meta.tables) {
    if (meta.tables.hasOwnProperty(property)) {
      var fileName = __dirname + '/models/' + property + '.js'
      var data = requireBookshelf();
      data += modelInformation(meta.tables[property]);
      fs.writeFileSync(fileName, data, 'utf-8');
    }
  }
}

Bookshelf.prototype.createModel = function(modelName) {
  var data = requireBookshelf();
  data += modelTemplate(modelName)

  var fileName = __dirname + '/models/' + modelName + '.js'
  fs.writeFileSync(fileName, data, 'utf-8');
}

var modelTemplate = function(modelName) {
  var singularTableName = lingo.en.singularize(modelName)
  var singularCapitalizedTableName = lingo.capitalize(singularTableName)

  return `\n\nvar ${singularCapitalizedTableName} = bookshelf.Model.extend({
});`
}

var requireBookshelf = function() {
  return "var bookshelf = require('bookshelf')(knex)"
}

var modelInformation = function(tableInfo) {
  var singularTableName = lingo.en.singularize(tableInfo.name)
  var singularCapitalizedTableName = lingo.capitalize(singularTableName)
  var data = `\n\nvar ${singularCapitalizedTableName} = bookshelf.Model.extend({
  tableName: '${tableInfo.name}',`

  for (var relation of tableInfo.relations.has_many) {
    var capitalizedRelationName = lingo.capitalize(relation)

    data += `\n  ${relation}: function() {
    return this.hasMany(${capitalizedRelationName});
  },`
    }

  for (var relation of tableInfo.relations.has_one) {
    var singularRelationName = lingo.en.singularize(relation)    
    var singularCapitalizedRelationName = lingo.capitalize(singularRelationName)

    data += `\n  ${singularRelationName}: function() {
    return this.hasOne(${singularCapitalizedRelationName});
  },`
    }    
  
  data += `\n});`

  return data
}

exports.Bookshelf = new Bookshelf();