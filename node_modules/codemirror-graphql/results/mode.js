'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _onlineParser = require('../utils/onlineParser');

var _onlineParser2 = _interopRequireDefault(_onlineParser);

var _RuleHelpers = require('../utils/RuleHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This mode defines JSON, but provides a data-laden parser state to enable
 * better code intelligence.
 */
_codemirror2.default.defineMode('graphql-results', function (config) {
  var parser = (0, _onlineParser2.default)({
    eatWhitespace: function eatWhitespace(stream) {
      return stream.eatSpace();
    },
    LexRules: LexRules,
    ParseRules: ParseRules,
    editorConfig: { tabSize: config.tabSize }
  });

  return {
    config: config,
    startState: parser.startState,
    token: parser.token,
    indent: indent,
    electricInput: /^\s*[}\]]/,
    fold: 'brace',
    closeBrackets: {
      pairs: '[]{}""',
      explode: '[]{}'
    }
  };
}); /**
     *  Copyright (c) 2015, Facebook, Inc.
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree. An additional grant
     *  of patent rights can be found in the PATENTS file in the same directory.
     */

function indent(state, textAfter) {
  var levels = state.levels;
  // If there is no stack of levels, use the current level.
  // Otherwise, use the top level, pre-emptively dedenting for close braces.
  var level = !levels || levels.length === 0 ? state.indentLevel : levels[levels.length - 1] - (this.electricInput.test(textAfter) ? 1 : 0);
  return level * this.config.indentUnit;
}

/**
 * The lexer rules. These are exactly as described by the spec.
 */
var LexRules = {
  // All Punctuation used in JSON.
  Punctuation: /^\[|]|\{|\}|:|,/,

  // JSON Number.
  Number: /^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,

  // JSON String.
  String: /^"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?/,

  // JSON literal keywords.
  Keyword: /^true|false|null/
};

/**
 * The parser rules for JSON.
 */
var ParseRules = {
  Document: [(0, _RuleHelpers.p)('{'), (0, _RuleHelpers.list)('Entry', (0, _RuleHelpers.p)(',')), (0, _RuleHelpers.p)('}')],
  Entry: [(0, _RuleHelpers.t)('String', 'def'), (0, _RuleHelpers.p)(':'), 'Value'],
  Value: function Value(token) {
    switch (token.kind) {
      case 'Number':
        return 'NumberValue';
      case 'String':
        return 'StringValue';
      case 'Punctuation':
        switch (token.value) {
          case '[':
            return 'ListValue';
          case '{':
            return 'ObjectValue';
        }
        return null;
      case 'Keyword':
        switch (token.value) {
          case 'true':case 'false':
            return 'BooleanValue';
          case 'null':
            return 'NullValue';
        }
        return null;
    }
  },

  NumberValue: [(0, _RuleHelpers.t)('Number', 'number')],
  StringValue: [(0, _RuleHelpers.t)('String', 'string')],
  BooleanValue: [(0, _RuleHelpers.t)('Keyword', 'builtin')],
  NullValue: [(0, _RuleHelpers.t)('Keyword', 'keyword')],
  ListValue: [(0, _RuleHelpers.p)('['), (0, _RuleHelpers.list)('Value', (0, _RuleHelpers.p)(',')), (0, _RuleHelpers.p)(']')],
  ObjectValue: [(0, _RuleHelpers.p)('{'), (0, _RuleHelpers.list)('ObjectField', (0, _RuleHelpers.p)(',')), (0, _RuleHelpers.p)('}')],
  ObjectField: [(0, _RuleHelpers.t)('String', 'property'), (0, _RuleHelpers.p)(':'), 'Value']
};