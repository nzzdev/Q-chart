'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.display = display;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _chartistConfig = require('./chartistConfig');

var chartistConfig = _interopRequireWildcard(_chartistConfig);

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

function getCombinedChartistConfig(chartConfig, chartType) {
  return Object.assign(chartistConfig[chartType.toLowerCase()], chartConfig);
}

function display(item, element) {
  if (!_chartist2['default'].hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';
  return new _chartist2['default'][item.chartType](element, getChartDataForChartist(item.data), getCombinedChartistConfig(item.chartConfig, item.chartType));
}