System.register([], function (_export) {
  "use strict";

  _export("default", onloadCSS);

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

  return {
    setters: [],
    execute: function () {}
  };
});