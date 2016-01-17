define(["exports", "module"], function (exports, module) {
  "use strict";

  module.exports = onloadCSS;

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
});