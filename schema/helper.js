var fs = require('fs'),
    lingo = require('lingo');

var Helper = {
  toMutation: function(action, columns, objTypeName) {
    var mutation = `\n  ` + action + objTypeName + `(`;

    for (var column in columns) {
      var dataType = columns[column].data_type;
      var isNullable = columns[column].is_nullable;
      var mVar = this.toQueryVariable(dataType);
      if (action === 'add') {
        if (mVar && column != 'id') {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
        }
      } else if (action === 'update') {
        if (mVar) {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
        }
      } else if (action === 'delete') {
        if (column === 'id') {
          mutation += column + `: ` + mVar + this.nullableMark(isNullable) + `, `
        }
      }
    }

    mutation = mutation.slice(0, -2);
    if (action === 'delete') {
      mutation += `): String`
    } else {
      mutation += `): ` + objTypeName
    }
    return mutation
  },
  toQueryEntry: function(columns, tableName) {
    var query = `\n  ` + tableName + `(`;

    for (var column in columns) {
      var dataType = columns[column].data_type;
      var qVar = this.toQueryVariable(dataType);
      if (qVar) {
        query += column + `: ` + qVar + `, `
      }
    }

    query = query.slice(0, -2);
    query += `): [` + this.singularCapitalizedTableName(tableName) + `]`
    return query
  },
  toQueryVariable: function(psqlType) {
    var typeMap = {
          'character varying': 'String',
          'integer': 'Int'
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
          'integer': 'Int'
        }

    if (typeMap[psqlType]) {
      return typeMap[psqlType];
    } else if (timestamp) {
      return 'String';
    } else {
      return psqlType;
    }
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