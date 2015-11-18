System.register(['chartist', './styles.css!'], function (_export) {
  'use strict';

  var Chartist;

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

  function display(item, element) {
    if (!Chartist.hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';
    return new Chartist[item.chartType](element, getChartDataForChartist(item.data), item.chartConfig);
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_stylesCss) {}],
    execute: function () {}
  };
});