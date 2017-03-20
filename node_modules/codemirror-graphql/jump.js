'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _getTypeInfo = require('./utils/getTypeInfo');

var _getTypeInfo2 = _interopRequireDefault(_getTypeInfo);

var _SchemaReference = require('./utils/SchemaReference');

require('./utils/jump-addon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Registers GraphQL "jump" links for CodeMirror.
 *
 * When command-hovering over a token, this converts it to a link, which when
 * pressed will call the provided onClick handler.
 *
 * Options:
 *
 *   - schema: GraphQLSchema provides positionally relevant info.
 *   - onClick: A function called when a named thing is clicked.
 *
 */

/**
 *  Copyright (c) 2017, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

_codemirror2.default.registerHelper('jump', 'graphql', function (token, options) {
  if (!options.schema || !options.onClick || !token.state) {
    return;
  }

  // Given a Schema and a Token, produce a "SchemaReference" which refers to
  // the particular artifact from the schema (such as a type, field, argument,
  // or directive) that token references.
  var state = token.state;
  var kind = state.kind;
  var step = state.step;
  var typeInfo = (0, _getTypeInfo2.default)(options.schema, state);

  if (kind === 'Field' && step === 0 && typeInfo.fieldDef || kind === 'AliasedField' && step === 2 && typeInfo.fieldDef) {
    return (0, _SchemaReference.getFieldReference)(typeInfo);
  } else if (kind === 'Directive' && step === 1 && typeInfo.directiveDef) {
    return (0, _SchemaReference.getDirectiveReference)(typeInfo);
  } else if (kind === 'Argument' && step === 0 && typeInfo.argDef) {
    return (0, _SchemaReference.getArgumentReference)(typeInfo);
  } else if (kind === 'EnumValue' && typeInfo.enumValue) {
    return (0, _SchemaReference.getEnumValueReference)(typeInfo);
  } else if (kind === 'NamedType' && typeInfo.type) {
    return (0, _SchemaReference.getTypeReference)(typeInfo);
  }
});