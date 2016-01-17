"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = onloadCSS;

function onloadCSS(ss, callback) {
  ss.onload = function () {
    ss.onload = null;
    if (callback) {
      callback.call(ss);
    }
  };

  if ("isApplicationInstalled" in navigator && "onloadcssdefined" in ss) {
    ss.onloadcssdefined(callback);
  }
}

module.exports = exports["default"];