define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getTextWidth = getTextWidth;
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");

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
});