'use strict';

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_codemirror2.default.defineOption('info', false, function (cm, options, old) {
  if (old && old !== _codemirror2.default.Init) {
    var oldOnMouseOver = cm.state.info.onMouseOver;
    _codemirror2.default.off(cm.getWrapperElement(), 'mouseover', oldOnMouseOver);
    clearTimeout(cm.state.info.hoverTimeout);
    delete cm.state.info;
  }

  if (options) {
    var state = cm.state.info = createState(options);
    state.onMouseOver = onMouseOver.bind(null, cm);
    _codemirror2.default.on(cm.getWrapperElement(), 'mouseover', state.onMouseOver);
  }
}); /**
     *  Copyright (c) 2017, Facebook, Inc.
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree. An additional grant
     *  of patent rights can be found in the PATENTS file in the same directory.
     */

function createState(options) {
  return {
    options: options instanceof Function ? { render: options } : options === true ? {} : options
  };
}

function getHoverTime(cm) {
  var options = cm.state.info.options;
  return options && options.hoverTime || 500;
}

function onMouseOver(cm, e) {
  var state = cm.state.info;

  var target = e.target || e.srcElement;
  if (target.nodeName !== 'SPAN' || state.hoverTimeout !== undefined) {
    return;
  }

  var box = target.getBoundingClientRect();

  var hoverTime = getHoverTime(cm);
  state.hoverTimeout = setTimeout(onHover, hoverTime);

  var onMouseMove = function onMouseMove() {
    clearTimeout(state.hoverTimeout);
    state.hoverTimeout = setTimeout(onHover, hoverTime);
  };

  var onMouseOut = function onMouseOut() {
    _codemirror2.default.off(document, 'mousemove', onMouseMove);
    _codemirror2.default.off(cm.getWrapperElement(), 'mouseout', onMouseOut);
    clearTimeout(state.hoverTimeout);
    state.hoverTimeout = undefined;
  };

  var onHover = function onHover() {
    _codemirror2.default.off(document, 'mousemove', onMouseMove);
    _codemirror2.default.off(cm.getWrapperElement(), 'mouseout', onMouseOut);
    state.hoverTimeout = undefined;
    onMouseHover(cm, box);
  };

  _codemirror2.default.on(document, 'mousemove', onMouseMove);
  _codemirror2.default.on(cm.getWrapperElement(), 'mouseout', onMouseOut);
}

function onMouseHover(cm, box) {
  var pos = cm.coordsChar({
    left: (box.left + box.right) / 2,
    top: (box.top + box.bottom) / 2
  });

  var state = cm.state.info;
  var options = state.options;
  var render = options.render || cm.getHelper(pos, 'info');
  if (render) {
    var token = cm.getTokenAt(pos, true);
    if (token) {
      var info = render(token, options, cm);
      if (info) {
        showPopup(cm, box, info);
      }
    }
  }
}

function showPopup(cm, box, info) {
  var popup = document.createElement('div');
  popup.className = 'CodeMirror-info';
  popup.appendChild(info);
  document.body.appendChild(popup);

  var popupBox = popup.getBoundingClientRect();
  var popupStyle = popup.currentStyle || window.getComputedStyle(popup);
  var popupWidth = popupBox.right - popupBox.left + parseFloat(popupStyle.marginLeft) + parseFloat(popupStyle.marginRight);
  var popupHeight = popupBox.bottom - popupBox.top + parseFloat(popupStyle.marginTop) + parseFloat(popupStyle.marginBottom);

  var topPos = box.bottom;
  if (popupHeight > window.innerHeight - box.bottom - 15 && box.top > window.innerHeight - box.bottom) {
    topPos = box.top - popupHeight;
  }

  if (topPos < 0) {
    topPos = box.bottom;
  }

  var leftPos = Math.max(0, window.innerWidth - popupWidth - 15);
  if (leftPos > box.left) {
    leftPos = box.left;
  }

  popup.style.opacity = 1;
  popup.style.top = topPos + 'px';
  popup.style.left = leftPos + 'px';

  var popupTimeout = void 0;

  var onMouseOverPopup = function onMouseOverPopup() {
    clearTimeout(popupTimeout);
  };

  var onMouseOut = function onMouseOut() {
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(hidePopup, 200);
  };

  var hidePopup = function hidePopup() {
    _codemirror2.default.off(popup, 'mouseover', onMouseOverPopup);
    _codemirror2.default.off(popup, 'mouseout', onMouseOut);
    _codemirror2.default.off(cm.getWrapperElement(), 'mouseout', onMouseOut);

    if (popup.style.opacity) {
      popup.style.opacity = 0;
      setTimeout(function () {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 600);
    } else if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  };

  _codemirror2.default.on(popup, 'mouseover', onMouseOverPopup);
  _codemirror2.default.on(popup, 'mouseout', onMouseOut);
  _codemirror2.default.on(cm.getWrapperElement(), 'mouseout', onMouseOut);
}