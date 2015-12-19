System.register(['../helpers'], function (_export) {
  'use strict';

  var getTextWidth;

  _export('isThereEnoughSpace', isThereEnoughSpace);

  function isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle) {
    var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

    var totalSpace = labelsToDisplay.reduce(function (sum, label) {
      return sum + getTextWidth(label, fontstyle);
    }, 0);

    return totalSpace < xAxisWidth;
  }

  return {
    setters: [function (_helpers) {
      getTextWidth = _helpers.getTextWidth;
    }],
    execute: function () {}
  };
});