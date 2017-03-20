'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _graphql = require('graphql');

var _forEachState = require('../utils/forEachState');

var _forEachState2 = _interopRequireDefault(_forEachState);

var _hintList = require('../utils/hintList');

var _hintList2 = _interopRequireDefault(_hintList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Registers a "hint" helper for CodeMirror.
 *
 * Using CodeMirror's "hint" addon: https://codemirror.net/demo/complete.html
 * Given an editor, this helper will take the token at the cursor and return a
 * list of suggested tokens.
 *
 * Options:
 *
 *   - variableToType: { [variable: string]: GraphQLInputType }
 *
 * Additional Events:
 *
 *   - hasCompletion (codemirror, data, token) - signaled when the hinter has a
 *     new list of completion suggestions.
 *
 */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

_codemirror2.default.registerHelper('hint', 'graphql-variables', function (editor, options) {
  var cur = editor.getCursor();
  var token = editor.getTokenAt(cur);

  var results = getVariablesHint(cur, token, options);
  if (results && results.list && results.list.length > 0) {
    results.from = _codemirror2.default.Pos(results.from.line, results.from.column);
    results.to = _codemirror2.default.Pos(results.to.line, results.to.column);
    _codemirror2.default.signal(editor, 'hasCompletion', editor, results, token);
  }

  return results;
});

function getVariablesHint(cur, token, options) {
  // If currently parsing an invalid state, attempt to hint to the prior state.
  var state = token.state.kind === 'Invalid' ? token.state.prevState : token.state;

  var kind = state.kind;
  var step = state.step;

  // Variables can only be an object literal.
  if (kind === 'Document' && step === 0) {
    return (0, _hintList2.default)(cur, token, [{ text: '{' }]);
  }

  var variableToType = options.variableToType;
  if (!variableToType) {
    return;
  }

  var typeInfo = getTypeInfo(variableToType, token.state);

  // Top level should typeahead possible variables.
  if (kind === 'Document' || kind === 'Variable' && step === 0) {
    var variableNames = Object.keys(variableToType);
    return (0, _hintList2.default)(cur, token, variableNames.map(function (name) {
      return {
        text: '"' + name + '": ',
        type: variableToType[name]
      };
    }));
  }

  // Input Object fields
  if (kind === 'ObjectValue' || kind === 'ObjectField' && step === 0) {
    if (typeInfo.fields) {
      var inputFields = Object.keys(typeInfo.fields).map(function (fieldName) {
        return typeInfo.fields[fieldName];
      });
      return (0, _hintList2.default)(cur, token, inputFields.map(function (field) {
        return {
          text: '"' + field.name + '": ',
          type: field.type,
          description: field.description
        };
      }));
    }
  }

  // Input values.
  if (kind === 'StringValue' || kind === 'NumberValue' || kind === 'BooleanValue' || kind === 'NullValue' || kind === 'ListValue' && step === 1 || kind === 'ObjectField' && step === 2 || kind === 'Variable' && step === 2) {
    var _ret = function () {
      var namedInputType = (0, _graphql.getNamedType)(typeInfo.type);
      if (namedInputType instanceof _graphql.GraphQLInputObjectType) {
        return {
          v: (0, _hintList2.default)(cur, token, [{ text: '{' }])
        };
      } else if (namedInputType instanceof _graphql.GraphQLEnumType) {
        var _ret2 = function () {
          var valueMap = namedInputType.getValues();
          var values = Object.keys(valueMap).map(function (name) {
            return valueMap[name];
          });
          return {
            v: {
              v: (0, _hintList2.default)(cur, token, values.map(function (value) {
                return {
                  text: '"' + value.name + '"',
                  type: namedInputType,
                  description: value.description
                };
              }))
            }
          };
        }();

        if (typeof _ret2 === "object") return _ret2.v;
      } else if (namedInputType === _graphql.GraphQLBoolean) {
        return {
          v: (0, _hintList2.default)(cur, token, [{ text: 'true', type: _graphql.GraphQLBoolean, description: 'Not false.' }, { text: 'false', type: _graphql.GraphQLBoolean, description: 'Not true.' }])
        };
      }
    }();

    if (typeof _ret === "object") return _ret.v;
  }
}

// Utility for collecting rich type information given any token's state
// from the graphql-variables-mode parser.
function getTypeInfo(variableToType, tokenState) {
  var info = {
    type: null,
    fields: null
  };

  (0, _forEachState2.default)(tokenState, function (state) {
    if (state.kind === 'Variable') {
      info.type = variableToType[state.name];
    } else if (state.kind === 'ListValue') {
      var nullableType = (0, _graphql.getNullableType)(info.type);
      info.type = nullableType instanceof _graphql.GraphQLList ? nullableType.ofType : null;
    } else if (state.kind === 'ObjectValue') {
      var objectType = (0, _graphql.getNamedType)(info.type);
      info.fields = objectType instanceof _graphql.GraphQLInputObjectType ? objectType.getFields() : null;
    } else if (state.kind === 'ObjectField') {
      var objectField = state.name && info.fields ? info.fields[state.name] : null;
      info.type = objectField && objectField.type;
    }
  });

  return info;
}