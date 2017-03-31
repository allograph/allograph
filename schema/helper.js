var fs = require('fs'),
    lingo = require('lingo');

var Helper = {
  toMutationField: function(action, columns, objTypeName) {
    var mutation = `\n  ` + action + objTypeName + `(`,
        numbersOfMutation = 0;

    for (var column in columns) {
      var dataType = columns[column].data_type,
          isNullable = columns[column].is_nullable,
          mVar = this.toQueryVariable(dataType);

      if (action === 'add') {
        if (mVar && column != 'id') {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
          numbersOfMutation ++;
        }
      } else if (action === 'update') {
        if (mVar) {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
          numbersOfMutation ++;
        }
      } else if (action === 'delete') {
        if (column === 'id') {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
          numbersOfMutation ++;
        }
      }
    }

    if (numbersOfMutation != 0) { mutation = mutation.slice(0, -2); mutation += `)` }
    if (numbersOfMutation === 0) { mutation = mutation.slice(0, -1); }

    if (action === 'delete') {
      mutation += `: String`
    } else {
      mutation += `: ` + objTypeName
    }
    return mutation
  },
  toQueryField: function(columns, tableName) {
    var query = `\n  ` + tableName + `(`,
        numbersOfQuery = 0;

    for (var column in columns) {
      var dataType = columns[column].data_type;
      var qVar = this.toQueryVariable(dataType);
      if (qVar) {
        query += column + `: ` + qVar + `, `;
        numbersOfQuery ++;
      }
    }

    if (numbersOfQuery != 0) { query = query.slice(0, -2); query += `)`; }
    if (numbersOfQuery === 0) { query = query.slice(0, -1); }
    query += `: [` + this.singularCapitalizedTableName(tableName) + `]`
    return query
  },
  toQueryVariable: function(psqlType) {
    var typeMap = {
          'character varying': 'String',
          'integer': 'Int',
          'boolean': 'Boolean',
          'text': 'String'
        }
    if (typeMap[psqlType]) {
      return typeMap[psqlType];
    } else {
      return false;
    }
  },
  toComment: function(description) {
    return `# ` + description
  },
  toGraphQLObj: function(objTypeName) {
    return `\ntype ` + objTypeName + ` {\n`
  },
  toGraphQLType: function(psqlType) {
    var timestamp = psqlType.match(/^timestamp/),
        typeMap = {
          'character varying': 'String',
          'integer': 'Int',
          'boolean': 'Boolean',
          'text': 'String'
        }

    if (typeMap[psqlType]) {
      return typeMap[psqlType];
    } else if (timestamp) {
      return 'String';
    } else {
      return psqlType;
    }
  },
  toGraphQLTypeFromJSType: function(jsType) {
    var typemap = {
      'Int': 'GraphQLInt',
      'String': 'GraphQLString',
      'Boolean': 'GraphQLBoolean',   
    }

    return typemap[jsType] || 'GraphQLString'
  },
  toGraphQLField: function(column, dataType, isNullable) {
    return  `  ` + column + `: ` +
            this.toGraphQLType(dataType) +
            this.nullableMark(isNullable) + `\n`
  },
  nullableMark: function(isNullable) {
    return isNullable ? `` : `!`
  },
  singularCapitalizedTableName: function(name) {
    var singularName = lingo.en.singularize(name)
    return lingo.capitalize(singularName);
  }
}

module.exports = Helper;