System.register(['chartist', './resources/chartistConfig', './resources/SizeObserver', './resources/types', './resources/seriesTypes', './resources/modifyChartistConfigBeforeRender', './styles.css!'], function (_export) {
  'use strict';

  var Chartist, getChartistConfig, SizeObserver, chartTypes, seriesTypes, modifyChartistConfigBeforeRender, types, sizeObserver, chars;

  _export('display', display);

  function getChartDataForChartist(item) {
    if (!item.data || !item.data.x || !item.data.y) return null;
    return {
      labels: item.data.x.data,
      series: item.data.y.data.filter(function (serie) {
        return serie.data;
      }).map(function (serie) {
        return serie.data;
      })
    };
  }

  function getCombinedChartistConfig(item, data, size, rect) {
    var config = Object.assign(getChartistConfig(item.type, size, data), item.chartConfig);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = chartTypes[item.type].options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var option = _step.value;

        switch (option.type) {
          case 'oneOf':
          case 'boolean':
            if (item.options && typeof item.options[option.name] !== undefined) {
              option.modifyConfig(config, item.options[option.name], data, size, rect);
            } else {
              option.modifyConfig(config, option.defaultValue, data, size, rect);
            }
            break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (item.data.x && item.data.x.type) {
      if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
        seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type.options, data, size, rect);
      }
    }

    modifyChartistConfigBeforeRender(config, item.type, data, size, rect);

    return config;
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

  function renderChartist(item, element, drawSize, rect) {
    var data = getChartDataForChartist(item);
    if (data && data !== null) {
      var config = getCombinedChartistConfig(item, data, drawSize, rect);
      new Chartist[chartTypes[item.type].chartistType](element, data, config);
    }
  }

  function getLegendHtml(item) {
    var html = '\n    <div class="q-chart__legend">';
    if (item.data && item.data.y && item.data.y.data) {
      for (var i in item.data.y.data) {
        var serie = item.data.y.data[i];
        html += '\n        <div class="q-chart__legend__item q-chart__legend__item--' + chars[i] + '">\n          <div class="q-chart__legend__item__box"></div>\n          <div class="q-chart__legend__item__text">' + serie.label + '</div>\n        </div>';
      }
    }
    html += '\n    </div>\n  ';
    return html;
  }

  function getContextHtml(item) {
    var html = '\n    <h3 class="q-chart__title">' + item.title + '</h3>';
    html += getLegendHtml(item);
    if (!item.data.y) {
      item.data.y = {};
    }
    html += '\n    <div class="q-chart__label-y-axis">' + (item.data.y.label || '') + '</div>\n    <div class="q-chart__chartist-container"></div>\n    <div class="q-chart__label-x-axis">' + (item.data.x.label || '') + '</div>\n    <div class="q-chart__footer">\n      <div class="q-chart__footer__notes">' + item.notes + '</div>\n      <div class="q-chart__footer__sources"></div>\n    </div>\n  ';
    return html;
  }

  function displayWithContext(item, element, drawSize, rect) {
    var el = document.createElement('section');
    el.setAttribute('class', 'q-chart');
    el.innerHTML = getContextHtml(item);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    element.appendChild(el);
    renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize, rect);
  }

  function displayWithoutContext(item, element, drawSize, rect) {
    renderChartist(item, element, drawSize, rect);
  }

  function display(item, element) {
    var withoutContext = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!element) throw 'Element is not defined';
    if (!Chartist.hasOwnProperty(types[item.type].chartistType)) throw 'Chartist Type (' + types[item.type].chartistType + ') not available';

    if (!item.data || !item.data.x) {
      return false;
    }

    sizeObserver.onResize(function (rect) {
      var drawSize = getElementSize(rect);
      if (withoutContext) {
        displayWithoutContext(item, element, drawSize, rect);
      } else {
        displayWithContext(item, element, drawSize, rect);
      }
    }, element, true);

    return true;
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_resourcesChartistConfig) {
      getChartistConfig = _resourcesChartistConfig.getConfig;
    }, function (_resourcesSizeObserver) {
      SizeObserver = _resourcesSizeObserver['default'];
    }, function (_resourcesTypes) {
      chartTypes = _resourcesTypes.types;
    }, function (_resourcesSeriesTypes) {
      seriesTypes = _resourcesSeriesTypes.seriesTypes;
    }, function (_resourcesModifyChartistConfigBeforeRender) {
      modifyChartistConfigBeforeRender = _resourcesModifyChartistConfigBeforeRender.modifyChartistConfigBeforeRender;
    }, function (_stylesCss) {}],
    execute: function () {
      types = chartTypes;

      _export('types', types);

      sizeObserver = new SizeObserver();
      chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];
    }
  };
});