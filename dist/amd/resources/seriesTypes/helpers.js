define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getLabelWidth = getLabelWidth;
  exports.isThereEnoughSpace = isThereEnoughSpace;
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");

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
});