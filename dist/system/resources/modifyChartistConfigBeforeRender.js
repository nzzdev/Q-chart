System.register(['./helpers', './seriesTypes'], function (_export) {
  'use strict';

  var getTextWidth, getLabelFontStyle, getDigitLabelFontStyle;

  _export('modifyChartistConfigBeforeRender', modifyChartistConfigBeforeRender);

  function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

    if ((type === 'Bar' || type === 'StackedBar') && size === 'large' && config.horizontalBars === false) {

      var noOfBars = undefined;
      if (type === 'Bar') {
        noOfBars = data.labels.length * data.series.length;
      } else {
        noOfBars = data.labels.length;
      }

      var barWidth = 10;
      var seriesBarDistance = 11;

      if (noOfBars <= 4) {
        barWidth = 36;
        seriesBarDistance = 37;
      } else if (noOfBars > 4 && noOfBars <= 8) {
        barWidth = 28;
        seriesBarDistance = 29;
      } else if (noOfBars > 8 && noOfBars <= 16) {
        barWidth = 20;
        seriesBarDistance = 21;
      } else if (noOfBars > 16 && noOfBars <= 24) {
        barWidth = 14;
        seriesBarDistance = 15;
      } else {
        barWidth = 10;
        seriesBarDistance = 11;
      }

      config.barWidth = barWidth;

      config.seriesBarDistance = seriesBarDistance;
    }

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
            possibleLabel = Math.round(datapoint * 10) / 10;
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
    setters: [function (_helpers) {
      getTextWidth = _helpers.getTextWidth;
    }, function (_seriesTypes) {
      getLabelFontStyle = _seriesTypes.getLabelFontStyle;
      getDigitLabelFontStyle = _seriesTypes.getDigitLabelFontStyle;
    }],
    execute: function () {

      Number.isInteger = Number.isInteger || function (value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
    }
  };
});