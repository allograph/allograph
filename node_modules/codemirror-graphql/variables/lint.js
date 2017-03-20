'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _graphql = require('graphql');

var _jsonParse = require('../utils/jsonParse');

var _jsonParse2 = _interopRequireDefault(_jsonParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Registers a "lint" helper for CodeMirror.
 *
 * Using CodeMirror's "lint" addon: https://codemirror.net/demo/lint.html
 * Given the text within an editor, this helper will take that text and return
 * a list of linter issues ensuring that correct variables were provided.
 *
 * Options:
 *
 *   - variableToType: { [variable: string]: GraphQLInputType }
 *
 */
_codemirror2.default.registerHelper('lint', 'graphql-variables', function (text, options, editor) {
  // If there's no text, do nothing.
  if (!text) {
    return [];
  }

  // First, linter needs to determine if there are any parsing errors.
  var ast = void 0;
  try {
    ast = (0, _jsonParse2.default)(text);
  } catch (syntaxError) {
    if (syntaxError.stack) {
      throw syntaxError;
    }
    return [lintError(editor, syntaxError, syntaxError.message)];
  }

  // If there are not yet known variables, do nothing.
  var variableToType = options.variableToType;
  if (!variableToType) {
    return [];
  }

  // Then highlight any issues with the provided variables.
  return validateVariables(editor, variableToType, ast);
});

// Given a variableToType object, a source text, and a JSON AST, produces a
// list of CodeMirror annotations for any variable validation errors.
/* eslint-disable max-len */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function validateVariables(editor, variableToType, variablesAST) {
  var errors = [];

  variablesAST.members.forEach(function (member) {
    var variableName = member.key.value;
    var type = variableToType[variableName];
    if (!type) {
      errors.push(lintError(editor, member.key, 'Variable "$' + variableName + '" does not appear in any GraphQL query.'));
    } else {
      validateValue(type, member.value).forEach(function (_ref) {
        var node = _ref[0],
            message = _ref[1];

        errors.push(lintError(editor, node, message));
      });
    }
  });

  return errors;
}

// Returns a list of validation errors in the form Array<[Node, String]>.
function validateValue(type, valueAST) {
  // Validate non-nullable values.
  if (type instanceof _graphql.GraphQLNonNull) {
    if (valueAST.kind === 'Null') {
      return [[valueAST, 'Type "' + type + '" is non-nullable and cannot be null.']];
    }
    return validateValue(type.ofType, valueAST);
  }

  if (valueAST.kind === 'Null') {
    return [];
  }

  // Validate lists of values, accepting a non-list as a list of one.
  if (type instanceof _graphql.GraphQLList) {
    var _ret = function () {
      var itemType = type.ofType;
      if (valueAST.kind === 'Array') {
        return {
          v: mapCat(valueAST.values, function (item) {
            return validateValue(itemType, item);
          })
        };
      }
      return {
        v: validateValue(itemType, valueAST)
      };
    }();

    if (typeof _ret === "object") return _ret.v;
  }

  // Validate input objects.
  if (type instanceof _graphql.GraphQLInputObjectType) {
    var _ret2 = function () {
      if (valueAST.kind !== 'Object') {
        return {
          v: [[valueAST, 'Type "' + type + '" must be an Object.']]
        };
      }

      // Validate each field in the input object.
      var providedFields = Object.create(null);
      var fieldErrors = mapCat(valueAST.members, function (member) {
        var fieldName = member.key.value;
        providedFields[fieldName] = true;
        var inputField = type.getFields()[fieldName];
        if (!inputField) {
          return [[member.key, 'Type "' + type + '" does not have a field "' + fieldName + '".']];
        }
        var fieldType = inputField ? inputField.type : undefined;
        return validateValue(fieldType, member.value);
      });

      // Look for missing non-nullable fields.
      Object.keys(type.getFields()).forEach(function (fieldName) {
        if (!providedFields[fieldName]) {
          var fieldType = type.getFields()[fieldName].type;
          if (fieldType instanceof _graphql.GraphQLNonNull) {
            fieldErrors.push([valueAST, 'Object of type "' + type + '" is missing required field "' + fieldName + '".']);
          }
        }
      });

      return {
        v: fieldErrors
      };
    }();

    if (typeof _ret2 === "object") return _ret2.v;
  }

  // Validate common scalars.
  if (type.name === 'Boolean' && valueAST.kind !== 'Boolean' || type.name === 'String' && valueAST.kind !== 'String' || type.name === 'ID' && valueAST.kind !== 'Number' && valueAST.kind !== 'String' || type.name === 'Float' && valueAST.kind !== 'Number' || type.name === 'Int' && (valueAST.kind !== 'Number' || (valueAST.value | 0) !== valueAST.value)) {
    return [[valueAST, 'Expected value of type "' + type + '".']];
  }

  // Validate enums and custom scalars.
  if (type instanceof _graphql.GraphQLEnumType || type instanceof _graphql.GraphQLScalarType) {
    if (valueAST.kind !== 'String' && valueAST.kind !== 'Number' && valueAST.kind !== 'Boolean' && valueAST.kind !== 'Null' || isNullish(type.parseValue(valueAST.value))) {
      return [[valueAST, 'Expected value of type "' + type + '".']];
    }
  }

  return [];
}

// Give a parent text, an AST node with location, and a message, produces a
// CodeMirror annotation object.
function lintError(editor, node, message) {
  return {
    message: message,
    severity: 'error',
    type: 'validation',
    from: editor.posFromIndex(node.start),
    to: editor.posFromIndex(node.end)
  };
}

function isNullish(value) {
  return value === null || value === undefined || value !== value;
}

function mapCat(array, mapper) {
  return Array.prototype.concat.apply([], array.map(mapper));
}