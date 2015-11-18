define(['exports', 'chartist', './styles.css!'], function (exports, _chartist, _stylesCss) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.display = display;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

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
    if (!_Chartist['default'].hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';
    return new _Chartist['default'][item.chartType](element, getChartDataForChartist(item.data), item.chartConfig);
  }
});