define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getTextWidth = getTextWidth;
  exports.getFlatDatapoints = getFlatDatapoints;
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

  function getFlatDatapoints(data) {
    if (!data.series.length || data.series[0].length === 0) {
      return null;
    }
    var flatDatapoints = data.series.reduce(function (a, b) {
      return a.concat(b);
    }).filter(function (cell) {
      return !isNaN(parseFloat(cell));
    }).slice(0).sort(function (a, b) {
      return parseFloat(a) - parseFloat(b);
    });

    return flatDatapoints;
  }
});