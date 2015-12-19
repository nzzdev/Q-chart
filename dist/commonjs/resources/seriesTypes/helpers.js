'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isThereEnoughSpace = isThereEnoughSpace;

var _helpers = require('../helpers');

function isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle) {
  var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

  var totalSpace = labelsToDisplay.reduce(function (sum, label) {
    return sum + (0, _helpers.getTextWidth)(label, fontstyle);
  }, 0);

  return totalSpace < xAxisWidth;
}