define(['exports', 'chartist', './resources/chartistConfig', './resources/SizeObserver', './styles.css!'], function (exports, _chartist, _resourcesChartistConfig, _resourcesSizeObserver, _stylesCss) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.display = display;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var _getChartistConfig = _interopRequireDefault(_resourcesChartistConfig);

  var _SizeObserver = _interopRequireDefault(_resourcesSizeObserver);

  var sizeObserver = new _SizeObserver['default']();

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
    return Object.assign((0, _getChartistConfig['default'])(chartType.toLowerCase(), size, data), chartConfig);
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
    if (!_Chartist['default'].hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';

    var data = getChartDataForChartist(item.data);
    drawSize = getElementSize(element);

    new _Chartist['default'][item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));

    if (cancelResize) {
      cancelResize();
    }
    cancelResize = sizeObserver.onResize(function () {
      var newSize = getElementSize(element);
      if (drawSize !== newSize) {
        drawSize = newSize;
        new _Chartist['default'][item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));
      }
    });
    return true;
  }
});