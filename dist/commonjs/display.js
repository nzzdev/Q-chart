'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.display = display;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

require('./styles.css!');

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
  if (!_chartist2['default'].hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';
  return new _chartist2['default'][item.chartType](element, getChartDataForChartist(item.data), item.chartConfig);
}