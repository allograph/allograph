"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectValues;
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function objectValues(object) {
  var keys = Object.keys(object);
  var len = keys.length;
  var values = new Array(len);
  for (var i = 0; i < len; ++i) {
    values[i] = object[keys[i]];
  }
  return values;
}