'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Registers a "lint" helper for CodeMirror.
 *
 * Using CodeMirror's "lint" addon: https://codemirror.net/demo/lint.html
 * Given the text within an editor, this helper will take that text and return
 * a list of linter issues, derived from GraphQL's parse and validate steps.
 *
 * Options:
 *
 *   - schema: GraphQLSchema provides the linter with positionally relevant info
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

_codemirror2.default.registerHelper('lint', 'graphql', function (text, options, editor) {
  var schema = options.schema;
  if (!schema) {
    return [];
  }

  try {
    var ast = (0, _graphql.parse)(text);
    var validationErrorAnnotations = mapCat((0, _graphql.validate)(schema, ast), function (error) {
      return annotations(editor, error, 'error', 'validation');
    });
    // Note: findDeprecatedUsages was added in graphql@0.9.0, but we want to
    // support older versions of graphql-js.
    var deprecationWarningAnnotations = !_graphql.findDeprecatedUsages ? [] : mapCat((0, _graphql.findDeprecatedUsages)(schema, ast), function (error) {
      return annotations(editor, error, 'warning', 'deprecation');
    });
    return validationErrorAnnotations.concat(deprecationWarningAnnotations);
  } catch (error) {
    var location = error.locations[0];
    var pos = _codemirror2.default.Pos(location.line - 1, location.column);
    var token = editor.getTokenAt(pos);
    return [{
      message: error.message,
      severity: 'error',
      type: 'syntax',
      from: _codemirror2.default.Pos(location.line - 1, token.start),
      to: _codemirror2.default.Pos(location.line - 1, token.end)
    }];
  }
});

function annotations(editor, error, severity, type) {
  return error.nodes.map(function (node) {
    var highlightNode = node.kind !== 'Variable' && node.name ? node.name : node.variable ? node.variable : node;
    return {
      message: error.message,
      severity: severity,
      type: type,
      from: editor.posFromIndex(highlightNode.loc.start),
      to: editor.posFromIndex(highlightNode.loc.end)
    };
  });
}

// General utility for map-cating (aka flat-mapping).
function mapCat(array, mapper) {
  return Array.prototype.concat.apply([], array.map(mapper));
}