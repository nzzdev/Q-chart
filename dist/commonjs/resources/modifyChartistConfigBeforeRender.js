'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.modifyChartistConfigBeforeRender = modifyChartistConfigBeforeRender;

function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

  if (type === 'Bar' && size === 'large') {

    var noOfBars = data.labels.length * data.series.length;

    var theBarWidth = 10;
    var theSeriesBarDistance = 11;

    if (noOfBars <= 4) {
      theBarWidth = 36;
      theSeriesBarDistance = 37;
    } else if (noOfBars > 4 && noOfBars <= 8) {
      theBarWidth = 28;
      theSeriesBarDistance = 29;
    } else if (noOfBars > 8 && noOfBars <= 16) {
      theBarWidth = 20;
      theSeriesBarDistance = 21;
    } else if (noOfBars > 16 && noOfBars <= 24) {
      theBarWidth = 14;
      theSeriesBarDistance = 15;
    } else {
      theBarWidth = 10;
      theSeriesBarDistance = 11;
    }

    config.barWidth = theBarWidth;

    config.seriesBarDistance = theSeriesBarDistance;
  }
}