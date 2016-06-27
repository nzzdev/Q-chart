System.register([], function (_export) {
  "use strict";

  var c, ctx;

  _export("getTextWidth", getTextWidth);

  _export("getFlatDatapoints", getFlatDatapoints);

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

  return {
    setters: [],
    execute: function () {
      c = document.createElement("canvas");
      ctx = c.getContext("2d");
    }
  };
});