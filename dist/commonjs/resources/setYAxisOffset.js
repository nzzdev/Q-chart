'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setYAxisOffset;

var _seriesTypes = require('./seriesTypes');

var _helpers = require('./helpers');

function setYAxisOffset(config, type, data) {
  var maxLabelWidth = 0;
  if ((type === 'Bar' || type === 'StackedBar') && config.horizontalBars) {
    maxLabelWidth = data.labels.reduce(function (maxWidth, label) {
      var width = (0, _helpers.getTextWidth)(label, (0, _seriesTypes.getLabelFontStyle)());
      if (maxWidth < width) {
        return width;
      }
      return maxWidth;
    }, 0);
  } else if (type === 'StackedBar') {
    var sums = [];
    for (var i = 0; i < data.series[0].length; i++) {
      if (!sums[i]) {
        sums[i] = 0;
      }
      for (var ii = 0; ii < data.series.length; ii++) {
        sums[i] = sums[i] + parseFloat(data.series[ii][i]);
      }
    }
    maxLabelWidth = sums.reduce(function (maxWidth, label) {
      var width = (0, _helpers.getTextWidth)(Math.round(label * 10) / 10, (0, _seriesTypes.getDigitLabelFontStyle)());
      if (maxWidth < width) {
        return width;
      }
      return maxWidth;
    }, 0);
  } else {
    maxLabelWidth = data.series.reduce(function (overallMaxWidth, serie) {
      var serieMaxWidth = serie.reduce(function (maxWidth, datapoint) {
        var possibleLabel = datapoint;
        if (!isNaN(parseFloat(datapoint))) {
          possibleLabel = parseFloat(datapoint / config.yValueDivisor).toFixed(1);
        }

        var width = (0, _helpers.getTextWidth)(possibleLabel, (0, _seriesTypes.getDigitLabelFontStyle)());
        if (maxWidth < width) {
          return width;
        }
        return maxWidth;
      }, 0);
      if (overallMaxWidth < serieMaxWidth) {
        return serieMaxWidth;
      }
      return overallMaxWidth;
    }, 0);
  }

  var offset = Math.ceil(maxLabelWidth + 5);
  if (offset < 30) {
    offset = 30;
  }
  config.axisY.offset = offset;
}

module.exports = exports['default'];