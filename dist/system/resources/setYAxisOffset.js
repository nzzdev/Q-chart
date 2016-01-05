System.register(['./seriesTypes', './helpers'], function (_export) {
  'use strict';

  var getLabelFontStyle, getDigitLabelFontStyle, getTextWidth;

  _export('default', setYAxisOffset);

  function setYAxisOffset(config, type, data) {
    var maxLabelWidth = 0;
    if ((type === 'Bar' || type === 'StackedBar') && config.horizontalBars) {
      maxLabelWidth = data.labels.reduce(function (maxWidth, label) {
        var width = getTextWidth(label, getLabelFontStyle());
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
        var width = getTextWidth(Math.round(label * 10) / 10, getDigitLabelFontStyle());
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

          var width = getTextWidth(possibleLabel, getDigitLabelFontStyle());
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

  return {
    setters: [function (_seriesTypes) {
      getLabelFontStyle = _seriesTypes.getLabelFontStyle;
      getDigitLabelFontStyle = _seriesTypes.getDigitLabelFontStyle;
    }, function (_helpers) {
      getTextWidth = _helpers.getTextWidth;
    }],
    execute: function () {}
  };
});