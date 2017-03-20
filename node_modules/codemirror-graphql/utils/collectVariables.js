'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = collectVariables;

var _graphql = require('graphql');

/**
 * Provided a schema and a document, produces a `variableToType` Object.
 */
function collectVariables(schema, documentAST) {
  var variableToType = Object.create(null);
  documentAST.definitions.forEach(function (definition) {
    if (definition.kind === 'OperationDefinition') {
      var variableDefinitions = definition.variableDefinitions;
      if (variableDefinitions) {
        variableDefinitions.forEach(function (_ref) {
          var variable = _ref.variable,
              type = _ref.type;

          var inputType = (0, _graphql.typeFromAST)(schema, type);
          if (inputType) {
            variableToType[variable.name.value] = inputType;
          }
        });
      }
    }
  });
  return variableToType;
} /**
   *  Copyright (c) 2015, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   */