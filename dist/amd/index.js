define(['exports', 'core-js/es6/object', 'chartist', './resources/chartistConfig', './resources/SizeObserver', './resources/types', './resources/seriesTypes', './resources/modifyChartistConfigBeforeRender', './styles.css!'], function (exports, _coreJsEs6Object, _chartist, _resourcesChartistConfig, _resourcesSizeObserver, _resourcesTypes, _resourcesSeriesTypes, _resourcesModifyChartistConfigBeforeRender, _stylesCss) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.display = display;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var _SizeObserver = _interopRequireDefault(_resourcesSizeObserver);

  var types = _resourcesTypes.types;

  exports.types = types;
  var sizeObserver = new _SizeObserver['default']();

  var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

  function getChartDataForChartist(item) {
    if (!item.data || !item.data.x || !item.data.y) return null;

    var data = {
      labels: item.data.x.data.slice(0),
      series: item.data.y.data.slice(0).filter(function (serie) {
        return serie.data.slice(0);
      }).map(function (serie) {
        return serie.data.slice(0);
      })
    };
    return data;
  }

  function getCombinedChartistConfig(item, data, size, rect) {
    var config = Object.assign((0, _resourcesChartistConfig.getConfig)(item.type, size, data), item.chartConfig);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _resourcesTypes.types[item.type].options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
      if (_resourcesSeriesTypes.seriesTypes.hasOwnProperty(item.data.x.type.id)) {

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyData(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyData) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyData(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyData) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyData(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyData) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyData(config, item.data.x.type.options, data, size, rect);
        }
      }
    }

    if (item.data.x && item.data.x.type) {
      if (_resourcesSeriesTypes.seriesTypes.hasOwnProperty(item.data.x.type.id)) {

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type.options, data, size, rect);
        }

        if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
          _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type.options, data, size, rect);
        }
      }
    }

    console.log(data);

    (0, _resourcesModifyChartistConfigBeforeRender.modifyChartistConfigBeforeRender)(config, item.type, data, size, rect);

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
      return new _Chartist['default'][_resourcesTypes.types[item.type].chartistType](element, data, config);
    }
    return undefined;
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
    html += '\n    <div class="q-chart__label-y-axis">' + (item.data.y.label || '') + '</div>\n    <div class="q-chart__chartist-container"></div>\n    <div class="q-chart__label-x-axis">' + (item.data.x.label || '') + '</div>\n    <div class="q-chart__footer">';
    if (item.notes) {
      html += '<div class="q-chart__footer__notes">' + item.notes + '</div>';
    }
    if (item.sources && item.sources.length && item.sources.length > 0 && item.sources[0].text.length > 0) {
      html += '<div class="q-chart__footer__sources">Quellen: ';
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = item.sources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var source = _step2.value;

          if (source.href && source.href.length > 0) {
            html += '<a href="' + source.href + '">' + source.text + '</a> ';
          } else {
            html += source.text + ' ';
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      html += '</div>';
    }
    html += '</div>';
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
    return renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize, rect);
  }

  function displayWithoutContext(item, element, drawSize, rect) {
    return renderChartist(item, element, drawSize, rect);
  }

  function display(item, element) {
    var withoutContext = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    return new Promise(function (resolve, reject) {
      try {
        if (!element) throw 'Element is not defined';
        if (!_Chartist['default'].hasOwnProperty(types[item.type].chartistType)) throw 'Chartist Type (' + types[item.type].chartistType + ') not available';

        if (!item.data || !item.data.x) {
          return false;
        }

        sizeObserver.onResize(function (rect) {
          var drawSize = getElementSize(rect);
          var chart = undefined;
          if (withoutContext) {
            chart = displayWithoutContext(item, element, drawSize, rect);
          } else {
            chart = displayWithContext(item, element, drawSize, rect);
          }

          if (chart && chart.on) {
            chart.on('created', function () {
              resolve(chart);
            });
          } else {
            reject(chart);
          }
        }, element, true);
      } catch (e) {
        reject(e);
      }
    });
  }
});