System.register(['chartist', './resources/chartistConfig', './resources/SizeObserver', './styles.css!'], function (_export) {
  'use strict';

  var Chartist, getChartistConfig, SizeObserver, sizeObserver, dataStore, cancelResize, drawSize;

  _export('display', display);

  function getChartDataForChartist(item) {
    if (!dataStore[item._id]) {
      dataStore[item._id] = {
        labels: item.data.x.data,
        series: item.data.series.map(function (serie) {
          return serie.data;
        })
      };
    }
    return dataStore[item._id];
  }

  function getCombinedChartistConfig(chartConfig, chartType, size, data) {
    return Object.assign(getChartistConfig(chartType.toLowerCase(), size, data), chartConfig);
  }

  function getElementSize(rect) {
    var size = 'small';
    if (rect.width && rect.width > 480) {
      size = 'large';
    } else {
      size = 'small';
    }
    return size;
  }

  function renderChartist(item, element, drawSize) {
    var data = getChartDataForChartist(item);
    var config = getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data);
    new Chartist[item.chartType](element, data, config);
  }

  function getLegendHtml(item) {
    return '\n    <div class="q-chart__legend">\n      <div class="q-chart__legend__item">\n        <div class="q-chart__legend__item__box"></div>\n        <div class="q-chart__legend__item__text">Legend</div>\n      </div>\n    </div>\n  ';
  }

  function getContextHtml(item) {
    var html = '\n    <h2 class="q-chart__title">' + item.title + '</h2>';
    html += getLegendHtml(item);
    if (!item.data.y) {
      item.data.y = {};
    }

    html += '\n    <div class="q-chart__label-y-axis">' + (item.data.y.label || '') + '</div>\n    <div class="q-chart__chartist-container"></div>\n    <div class="q-chart__label-x-axis">' + item.data.x.label + '</div>\n    <div class="q-chart__notes"></div>\n  ';
    return html;
  }

  function displayWithContext(item, element, drawSize) {
    var el = document.createElement('section');
    el.setAttribute('class', 'q-chart');
    el.innerHTML = getContextHtml(item);
    element.appendChild(el);
    renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize);
  }

  function displayWithoutContext(item, element, drawSize) {
    renderChartist(item, element, drawSize);
  }

  function display(item, element) {
    var withoutContext = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!Chartist.hasOwnProperty(item.chartType)) throw 'chartType (' + item.chartType + ') not available';

    drawSize = getElementSize(element.getBoundingClientRect());

    if (withoutContext) {
      displayWithoutContext(item, element, drawSize);
    } else {
      displayWithContext(item, element, drawSize);
    }

    if (cancelResize) {
      cancelResize();
    }

    cancelResize = sizeObserver.onResize(function (rect) {
      var newSize = getElementSize(rect);
      if (drawSize !== newSize) {
        drawSize = newSize;
        if (withoutContext) {
          displayWithoutContext(item, element, drawSize);
        } else {
          displayWithContext(item, element, drawSize);
        }
      }
    }, element);

    return true;
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_resourcesChartistConfig) {
      getChartistConfig = _resourcesChartistConfig['default'];
    }, function (_resourcesSizeObserver) {
      SizeObserver = _resourcesSizeObserver['default'];
    }, function (_stylesCss) {}],
    execute: function () {
      sizeObserver = new SizeObserver();
      dataStore = {};
    }
  };
});