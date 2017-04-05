var refParser = require('json-schema-ref-parser');
var lingo = require('lingo');

var schemaPromise = function() {
  var schema = refParser.dereference('./swagger/swagger.json');
  // schema.then(console.log)
  return schema;
}

var toGraphQLType = function() {
  var data = {};

  schemaPromise().then(schema => {
    data['data'] = schema.info.title;
    data['tables'] = {};

    for (var obj in schema.definitions) {
      var tableName = lingo.en.pluralize(obj.toLowerCase()),
          objSingularNames = Object.keys(schema.definitions).map(function(name) { return name.toLowerCase(); }),
          objPluralNames = objSingularNames.map(function(name) { return lingo.en.pluralize(name); });

      data['tables'][tableName] = {
        'name': tableName,
        'description': 'This is a Definitions Object called ' + obj
      }
      data['tables'][tableName]['fields'] = {};

      for (var field in schema.definitions[obj].properties) {
        data['tables'][tableName]['fields'][field] = {
          'is_nullable': schema.definitions[obj].required ? schema.definitions[obj].required.indexOf(field) === -1 : true,
          'data_type': schema.definitions[obj].properties[field].type
        }

        if (schema.definitions[obj].properties[field].hasOwnProperty('default')) {
          data['tables'][tableName]['fields'][field]['column_default'] = schema.definitions[obj].properties[field].default;
        }

        if (data['tables'][tableName]['fields'][field].data_type === 'object') {
          if (objSingularNames.indexOf(field) !== -1) {
            data['tables'][tableName]['fields'][field].data_type = lingo.capitalize(field);
          }
        } else if (data['tables'][tableName]['fields'][field].data_type === 'array') {
          if (objPluralNames.indexOf(field) !== -1) {
            data['tables'][tableName]['fields'][field].data_type = '[' + lingo.capitalize(lingo.en.singularize(field)) + ']'
          }
        }
      }
    }

    console.log(data.tables.orders.fields)
  });


}

toGraphQLType()