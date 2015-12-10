System.register([], function (_export) {
  'use strict';

  _export('modifyChartistConfigBeforeRender', modifyChartistConfigBeforeRender);

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

    if (config.horizontalBars) {
      var maxLength = 0;
      for (var i = 0; i < data.labels.length; i++) {

        if (data.currentLabels && data.currentLabels[i]) {
          if (data.currentLabels[i].length > maxLength) {
            maxLength = data.currentLabels[i].length;
          }
        } else {
          if (data.labels[i].length > maxLength) {
            maxLength = data.labels[i].length;
          }
        }
      }
      config.axisY.offset = maxLength * 8;
    }
  }

  return {
    setters: [],
    execute: function () {}
  };
});