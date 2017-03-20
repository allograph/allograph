'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTypeInfo;

var _graphql = require('graphql');

var _introspection = require('graphql/type/introspection');

var _forEachState = require('./forEachState');

var _forEachState2 = _interopRequireDefault(_forEachState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Utility for collecting rich type information given any token's state
 * from the graphql-mode parser.
 */
function getTypeInfo(schema, tokenState) {
  var info = {
    schema: schema,
    type: null,
    parentType: null,
    inputType: null,
    directiveDef: null,
    fieldDef: null,
    argDef: null,
    argDefs: null,
    objectFieldDefs: null
  };

  (0, _forEachState2.default)(tokenState, function (state) {
    switch (state.kind) {
      case 'Query':
      case 'ShortQuery':
        info.type = schema.getQueryType();
        break;
      case 'Mutation':
        info.type = schema.getMutationType();
        break;
      case 'Subscription':
        info.type = schema.getSubscriptionType();
        break;
      case 'InlineFragment':
      case 'FragmentDefinition':
        if (state.type) {
          info.type = schema.getType(state.type);
        }
        break;
      case 'Field':
      case 'AliasedField':
        info.fieldDef = info.type && state.name ? getFieldDef(schema, info.parentType, state.name) : null;
        info.type = info.fieldDef && info.fieldDef.type;
        break;
      case 'SelectionSet':
        info.parentType = (0, _graphql.getNamedType)(info.type);
        break;
      case 'Directive':
        info.directiveDef = state.name && schema.getDirective(state.name);
        break;
      case 'Arguments':
        var parentDef = state.prevState.kind === 'Field' ? info.fieldDef : state.prevState.kind === 'Directive' ? info.directiveDef : state.prevState.kind === 'AliasedField' ? state.prevState.name && getFieldDef(schema, info.parentType, state.prevState.name) : null;
        info.argDefs = parentDef && parentDef.args;
        break;
      case 'Argument':
        info.argDef = null;
        if (info.argDefs) {
          for (var i = 0; i < info.argDefs.length; i++) {
            if (info.argDefs[i].name === state.name) {
              info.argDef = info.argDefs[i];
              break;
            }
          }
        }
        info.inputType = info.argDef && info.argDef.type;
        break;
      case 'EnumValue':
        var enumType = (0, _graphql.getNamedType)(info.inputType);
        info.enumValue = enumType instanceof _graphql.GraphQLEnumType ? find(enumType.getValues(), function (val) {
          return val.value === state.name;
        }) : null;
        break;
      case 'ListValue':
        var nullableType = (0, _graphql.getNullableType)(info.inputType);
        info.inputType = nullableType instanceof _graphql.GraphQLList ? nullableType.ofType : null;
        break;
      case 'ObjectValue':
        var objectType = (0, _graphql.getNamedType)(info.inputType);
        info.objectFieldDefs = objectType instanceof _graphql.GraphQLInputObjectType ? objectType.getFields() : null;
        break;
      case 'ObjectField':
        var objectField = state.name && info.objectFieldDefs ? info.objectFieldDefs[state.name] : null;
        info.inputType = objectField && objectField.type;
        break;
      case 'NamedType':
        info.type = schema.getType(state.name);
        break;
    }
  });

  return info;
}

// Gets the field definition given a type and field name
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function getFieldDef(schema, type, fieldName) {
  if (fieldName === _introspection.SchemaMetaFieldDef.name && schema.getQueryType() === type) {
    return _introspection.SchemaMetaFieldDef;
  }
  if (fieldName === _introspection.TypeMetaFieldDef.name && schema.getQueryType() === type) {
    return _introspection.TypeMetaFieldDef;
  }
  if (fieldName === _introspection.TypeNameMetaFieldDef.name && (0, _graphql.isCompositeType)(type)) {
    return _introspection.TypeNameMetaFieldDef;
  }
  if (type.getFields) {
    return type.getFields()[fieldName];
  }
}

// Returns the first item in the array which causes predicate to return truthy.
function find(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
}