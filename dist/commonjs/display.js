'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.display = display;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _chartistConfig = require('./chartistConfig');

var _chartistConfig2 = _interopRequireDefault(_chartistConfig);

var _SizeObserver = require('./SizeObserver');

var _SizeObserver2 = _interopRequireDefault(_SizeObserver);

require('./styles.css!');

var sizeObserver = new _SizeObserver2['default']();

function getChartDataForChartist(data) {
  var dataForChart = {
    labels: data.x.data,
    series: data.series.map(function (serie) {
      return serie.data;
    })
  };
  return dataForChart;
}

function getCombinedChartistConfig(chartConfig, chartType, size, data) {
  return Object.assign((0, _chartistConfig2['default'])(chartType.toLowerCase(), size, data), chartConfig);
}

function getElementSize(element) {
  var size = 'small';
  if (element.getBoundingClientRect) {
    var rect = element.getBoundingClientRect();
    if (rect.width && rect.width > 480) {
      size = 'large';
    } else {
      size = 'small';
    }
  }
  return size;
}

var cancelResize;
var drawSize;

function display(item, element) {
  if (!_chartist2['default'].hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';

  var data = getChartDataForChartist(item.data);
  drawSize = getElementSize(element);

  new _chartist2['default'][item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));

  if (cancelResize) {
    cancelResize();
  }
  cancelResize = sizeObserver.onResize(function () {
    var newSize = getElementSize(element);
    if (drawSize !== newSize) {
      drawSize = newSize;
      new _chartist2['default'][item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));
    }
  });
  return true;
}