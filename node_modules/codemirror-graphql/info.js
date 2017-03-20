'use strict';

var _graphql = require('graphql');

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _getTypeInfo = require('./utils/getTypeInfo');

var _getTypeInfo2 = _interopRequireDefault(_getTypeInfo);

var _SchemaReference = require('./utils/SchemaReference');

require('./utils/info-addon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Registers GraphQL "info" tooltips for CodeMirror.
 *
 * When hovering over a token, this presents a tooltip explaining it.
 *
 * Options:
 *
 *   - schema: GraphQLSchema provides positionally relevant info.
 *   - hoverTime: The number of ms to wait before showing info. (Default 500)
 *   - renderDescription: Convert a description to some HTML, Useful since
 *                        descriptions are often Markdown formatted.
 *   - onClick: A function called when a named thing is clicked.
 *
 */
_codemirror2.default.registerHelper('info', 'graphql', function (token, options) {
  if (!options.schema || !token.state) {
    return;
  }

  var state = token.state;
  var kind = state.kind;
  var step = state.step;
  var typeInfo = (0, _getTypeInfo2.default)(options.schema, token.state);

  // Given a Schema and a Token, produce the contents of an info tooltip.
  // To do this, create a div element that we will render "into" and then pass
  // it to various rendering functions.
  if (kind === 'Field' && step === 0 && typeInfo.fieldDef || kind === 'AliasedField' && step === 2 && typeInfo.fieldDef) {
    var into = document.createElement('div');
    renderField(into, typeInfo, options);
    renderDescription(into, options, typeInfo.fieldDef);
    return into;
  } else if (kind === 'Directive' && step === 1 && typeInfo.directiveDef) {
    var _into = document.createElement('div');
    renderDirective(_into, typeInfo, options);
    renderDescription(_into, options, typeInfo.directiveDef);
    return _into;
  } else if (kind === 'Argument' && step === 0 && typeInfo.argDef) {
    var _into2 = document.createElement('div');
    renderArg(_into2, typeInfo, options);
    renderDescription(_into2, options, typeInfo.argDef);
    return _into2;
  } else if (kind === 'EnumValue' && typeInfo.enumValue && typeInfo.enumValue.description) {
    var _into3 = document.createElement('div');
    renderEnumValue(_into3, typeInfo, options);
    renderDescription(_into3, options, typeInfo.enumValue);
    return _into3;
  } else if (kind === 'NamedType' && typeInfo.type && typeInfo.type.description) {
    var _into4 = document.createElement('div');
    renderType(_into4, typeInfo, options, typeInfo.type);
    renderDescription(_into4, options, typeInfo.type);
    return _into4;
  }
});
/**
 *  Copyright (c) 2017, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function renderField(into, typeInfo, options) {
  renderQualifiedField(into, typeInfo, options);
  renderTypeAnnotation(into, typeInfo, options, typeInfo.type);
}

function renderQualifiedField(into, typeInfo, options) {
  var fieldName = typeInfo.fieldDef.name;
  if (fieldName.slice(0, 2) !== '__') {
    renderType(into, typeInfo, options, typeInfo.parentType);
    text(into, '.');
  }
  text(into, fieldName, 'field-name', options, (0, _SchemaReference.getFieldReference)(typeInfo));
}

function renderDirective(into, typeInfo, options) {
  var name = '@' + typeInfo.directiveDef.name;
  text(into, name, 'directive-name', options, (0, _SchemaReference.getDirectiveReference)(typeInfo));
}

function renderArg(into, typeInfo, options) {
  if (typeInfo.directiveDef) {
    renderDirective(into, typeInfo, options);
  } else if (typeInfo.fieldDef) {
    renderQualifiedField(into, typeInfo, options);
  }

  var name = typeInfo.argDef.name;
  text(into, '(');
  text(into, name, 'arg-name', options, (0, _SchemaReference.getArgumentReference)(typeInfo));
  renderTypeAnnotation(into, typeInfo, options, typeInfo.inputType);
  text(into, ')');
}

function renderTypeAnnotation(into, typeInfo, options, t) {
  text(into, ': ');
  renderType(into, typeInfo, options, t);
}

function renderEnumValue(into, typeInfo, options) {
  var name = typeInfo.enumValue.name;
  renderType(into, typeInfo, options, typeInfo.inputType);
  text(into, '.');
  text(into, name, 'enum-value', options, (0, _SchemaReference.getEnumValueReference)(typeInfo));
}

function renderType(into, typeInfo, options, t) {
  if (t instanceof _graphql.GraphQLNonNull) {
    renderType(into, typeInfo, options, t.ofType);
    text(into, '!');
  } else if (t instanceof _graphql.GraphQLList) {
    text(into, '[');
    renderType(into, typeInfo, options, t.ofType);
    text(into, ']');
  } else {
    text(into, t.name, 'type-name', options, (0, _SchemaReference.getTypeReference)(typeInfo, t));
  }
}

function renderDescription(into, options, def) {
  var description = def.description;
  if (description) {
    var descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'info-description';
    if (options.renderDescription) {
      descriptionDiv.innerHTML = options.renderDescription(description);
    } else {
      descriptionDiv.appendChild(document.createTextNode(description));
    }
    into.appendChild(descriptionDiv);
  }

  renderDeprecation(into, options, def);
}

function renderDeprecation(into, options, def) {
  var reason = def.deprecationReason;
  if (reason) {
    var deprecationDiv = document.createElement('div');
    deprecationDiv.className = 'info-deprecation';
    if (options.renderDescription) {
      deprecationDiv.innerHTML = options.renderDescription(reason);
    } else {
      deprecationDiv.appendChild(document.createTextNode(reason));
    }
    var label = document.createElement('span');
    label.className = 'info-deprecation-label';
    label.appendChild(document.createTextNode('Deprecated: '));
    deprecationDiv.insertBefore(label, deprecationDiv.firstChild);
    into.appendChild(deprecationDiv);
  }
}

function text(into, content, className, options, ref) {
  if (className) {
    (function () {
      var onClick = options.onClick;
      var node = document.createElement(onClick ? 'a' : 'span');
      if (onClick) {
        // Providing a href forces proper a tag behavior, though we don't actually
        // want clicking the node to navigate anywhere.
        node.href = 'javascript:void 0'; // eslint-disable-line no-script-url
        node.addEventListener('click', function (e) {
          onClick(ref, e);
        });
      }
      node.className = className;
      node.appendChild(document.createTextNode(content));
      into.appendChild(node);
    })();
  } else {
    into.appendChild(document.createTextNode(content));
  }
}