'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Argument;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _graphql = require('graphql');

var _TypeLink = require('./TypeLink');

var _TypeLink2 = _interopRequireDefault(_TypeLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Argument(_ref) {
  var arg = _ref.arg,
      onClickType = _ref.onClickType,
      showDefaultValue = _ref.showDefaultValue;

  return _react2.default.createElement(
    'span',
    { className: 'arg' },
    _react2.default.createElement(
      'span',
      { className: 'arg-name' },
      arg.name
    ),
    ': ',
    _react2.default.createElement(_TypeLink2.default, { type: arg.type, onClick: onClickType }),
    arg.defaultValue !== undefined && showDefaultValue !== false && _react2.default.createElement(
      'span',
      null,
      ' = ',
      _react2.default.createElement(
        'span',
        { className: 'arg-default-value' },
        (0, _graphql.print)((0, _graphql.astFromValue)(arg.defaultValue, arg.type))
      )
    )
  );
} /**
   *  Copyright (c) Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the license found in the
   *  LICENSE file in the root directory of this source tree.
   */

Argument.propTypes = {
  arg: _react.PropTypes.object.isRequired,
  onClickType: _react.PropTypes.func.isRequired,
  showDefaultValue: _react.PropTypes.bool
};