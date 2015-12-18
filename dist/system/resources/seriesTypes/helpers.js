System.register([], function (_export) {
  "use strict";

  var c, ctx;

  _export("getLabelWidth", getLabelWidth);

  _export("isThereEnoughSpace", isThereEnoughSpace);

  function getLabelWidth(label, getFontstyle) {
    var length = undefined;
    if (ctx) {
      ctx.font = getFontstyle;
      length = ctx.measureText(label).width;
    } else {
      length = label.length * 9;
    }
    return length;
  }

  function isThereEnoughSpace(labelsToDisplay, rect, config) {
    var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

    var totalSpace = labelsToDisplay.reduce(function (sum, label) {
      return sum + getLabelWidth(label);
    });

    return totalSpace < xAxisWidth;
  }

  return {
    setters: [],
    execute: function () {
      c = document.createElement("canvas");
      ctx = c.getContext("2d");
    }
  };
});