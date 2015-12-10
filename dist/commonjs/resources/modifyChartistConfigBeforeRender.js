'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.modifyChartistConfigBeforeRender = modifyChartistConfigBeforeRender;
Number.isInteger = Number.isInteger || function (value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

  if (type === 'Bar' && size === 'large') {

    var noOfBars = data.labels.length * data.series.length;

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

  var maxLength = 0;
  var isNumber = false;
  if ((type === 'Bar' || type === 'StackedBar') && config.horizontalBars) {
    for (var i = 0; i < data.labels.length; i++) {
      var _length = 0;
      if (data.currentLabels && data.currentLabels[i]) {
        if (Number.isInteger(data.currentLabels[i])) {
          isNumber = true;
          _length = Math.floor(data.currentLabels[i]).toString().length;
        } else {
          _length = data.currentLabels[i].length;
        }
      } else {
        if (Number.isInteger(data.labels[i])) {
          isNumber = true;
          _length = Math.floor(data.labels[i]).toString().length;
        } else {
          _length = data.labels[i].length;
        }
      }
      if (_length > maxLength) {
        maxLength = _length;
      }
    }
  } else {
    data.series.map(function (serie) {
      serie.map(function (datapoint) {
        var length = 0;
        if (Number.isInteger(datapoint)) {
          isNumber = true;
          length = Math.floor(datapoint).toString().length;
        } else {
          length = datapoint.length;
        }
        if (length > maxLength) {
          maxLength = length;
        }
      });
    });
  }
  var averageCharLength = isNumber ? 10 : 9;
  config.axisY.offset = maxLength * averageCharLength;
}