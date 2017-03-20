'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.opt = opt;
exports.list = list;
exports.butNot = butNot;
exports.t = t;
exports.p = p;
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
// These functions help build matching rules for ParseRules.

// An optional rule.
function opt(ofRule) {
  return { ofRule: ofRule };
}

// A list of another rule.
function list(ofRule, separator) {
  return { ofRule: ofRule, isList: true, separator: separator };
}

// An constraint described as `but not` in the GraphQL spec.
function butNot(rule, exclusions) {
  var ruleMatch = rule.match;
  rule.match = function (token) {
    return ruleMatch(token) && exclusions.every(function (exclusion) {
      return !exclusion.match(token);
    });
  };
  return rule;
}

// Token of a kind
function t(kind, style) {
  return { style: style, match: function match(token) {
      return token.kind === kind;
    } };
}

// Punctuator
function p(value, style) {
  return {
    style: style || 'punctuation',
    match: function match(token) {
      return token.kind === 'Punctuation' && token.value === value;
    }
  };
}