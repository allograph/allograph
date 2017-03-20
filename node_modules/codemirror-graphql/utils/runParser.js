'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runParser;

var _CharacterStream = require('./CharacterStream');

var _CharacterStream2 = _interopRequireDefault(_CharacterStream);

var _onlineParser = require('./onlineParser');

var _onlineParser2 = _interopRequireDefault(_onlineParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function runParser(sourceText, parserOptions, callbackFn) {
  var parser = (0, _onlineParser2.default)(parserOptions);
  var state = parser.startState();
  var lines = sourceText.split('\n');

  lines.forEach(function (line) {
    var stream = new _CharacterStream2.default(line);
    while (!stream.eol()) {
      var style = parser.token(stream, state);
      callbackFn(stream, state, style);
    }
  });
}