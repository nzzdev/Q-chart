System.register(['chartist', './chartistConfig', './styles.css!'], function (_export) {
  'use strict';

  var Chartist, chartistConfig;

  _export('display', display);

  function getChartDataForChartist(data) {
    var dataForChart = {
      labels: data.x.data,
      series: data.series.map(function (serie) {
        return serie.data;
      })
    };
    return dataForChart;
  }

  function getCombinedChartistConfig(chartConfig, chartType) {
    return Object.assign(chartistConfig[chartType.toLowerCase()], chartConfig);
  }

  function display(item, element) {
    if (!Chartist.hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';
    return new Chartist[item.chartType](element, getChartDataForChartist(item.data), getCombinedChartistConfig(item.chartConfig, item.chartType));
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_chartistConfig) {
      chartistConfig = _chartistConfig;
    }, function (_stylesCss) {}],
    execute: function () {}
  };
});