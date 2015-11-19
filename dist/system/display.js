System.register(['chartist', './chartistConfig', './SizeObserver', './styles.css!'], function (_export) {
  'use strict';

  var Chartist, getChartistConfig, SizeObserver, sizeObserver, cancelResize, drawSize;

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

  function getCombinedChartistConfig(chartConfig, chartType, size, data) {
    return Object.assign(getChartistConfig(chartType.toLowerCase(), size, data), chartConfig);
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

  function display(item, element) {
    if (!Chartist.hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';

    var data = getChartDataForChartist(item.data);
    drawSize = getElementSize(element);

    new Chartist[item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));

    if (cancelResize) {
      cancelResize();
    }
    cancelResize = sizeObserver.onResize(function () {
      var newSize = getElementSize(element);
      if (drawSize !== newSize) {
        drawSize = newSize;
        new Chartist[item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));
      }
    });
    return true;
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_chartistConfig) {
      getChartistConfig = _chartistConfig['default'];
    }, function (_SizeObserver) {
      SizeObserver = _SizeObserver['default'];
    }, function (_stylesCss) {}],
    execute: function () {
      sizeObserver = new SizeObserver();
    }
  };
});