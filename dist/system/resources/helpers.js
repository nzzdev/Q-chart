System.register([], function (_export) {
  "use strict";

  var c, ctx;

  _export("getTextWidth", getTextWidth);

  function getTextWidth(label, fontstyle) {
    var length = undefined;
    if (ctx) {
      ctx.font = fontstyle;
      length = ctx.measureText(label).width + 4;
    } else {
        length = label.length * 9;
      }
    return length;
  }

  return {
    setters: [],
    execute: function () {
      c = document.createElement("canvas");
      ctx = c.getContext("2d");
    }
  };
});