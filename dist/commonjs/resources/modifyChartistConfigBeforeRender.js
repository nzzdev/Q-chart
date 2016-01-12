'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = modifyChartistConfigBeforeRender;
Number.isInteger = Number.isInteger || function (value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

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

  if (!config.horizontalBars) {
    config.chartPadding.top = 12;
  }
}

module.exports = exports['default'];