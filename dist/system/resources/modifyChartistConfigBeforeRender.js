System.register([], function (_export) {
  'use strict';

  _export('modifyChartistConfigBeforeRender', modifyChartistConfigBeforeRender);

  function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

    if (type === 'Bar' && size === 'large') {

      var noOfBars = data.labels.length * data.series.length;
      console.log(noOfBars);

      var theBarWidth = 10;
      var theSeriesBarDistance = 10;

      if (noOfBars <= 8) {
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

  return {
    setters: [],
    execute: function () {}
  };
});