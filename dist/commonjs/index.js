'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.getFormattedDate = getFormattedDate;
exports.getDivisor = getDivisor;
exports.getDivisorString = getDivisorString;
exports.display = display;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('paulirish/matchMedia.js');

require('paulirish/matchMedia.js/matchMedia.addListener.js');

require('core-js/es6/object');

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _resourcesChartistConfig = require('./resources/chartistConfig');

var _resourcesSizeObserver = require('./resources/SizeObserver');

var _resourcesSizeObserver2 = _interopRequireDefault(_resourcesSizeObserver);

var _resourcesTypes = require('./resources/types');

var _resourcesSeriesTypes = require('./resources/seriesTypes');

var _resourcesSeriesTypesDateSeriesType = require('./resources/seriesTypes/dateSeriesType');

var _resourcesSeriesTypesDateConfigPerInterval = require('./resources/seriesTypes/dateConfigPerInterval');

var _resourcesHelpers = require('./resources/helpers');

var _resourcesModifyChartistConfigBeforeRender = require('./resources/modifyChartistConfigBeforeRender');

var _resourcesModifyChartistConfigBeforeRender2 = _interopRequireDefault(_resourcesModifyChartistConfigBeforeRender);

var _resourcesSetYAxisOffset = require('./resources/setYAxisOffset');

var _resourcesSetYAxisOffset2 = _interopRequireDefault(_resourcesSetYAxisOffset);

var _rendererConfigDefaults = require('./rendererConfigDefaults');

var _rendererConfigDefaults2 = _interopRequireDefault(_rendererConfigDefaults);

var _fgLoadcss = require('fg-loadcss');

var _fgLoadcss2 = _interopRequireDefault(_fgLoadcss);

var _resourcesOnloadCSS = require('./resources/onloadCSS');

var _resourcesOnloadCSS2 = _interopRequireDefault(_resourcesOnloadCSS);

var types = _resourcesTypes.types;

exports.types = types;
var sizeObserver = new _resourcesSizeObserver2['default']();

var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

function getChartDataForChartist(item) {
  if (!item.data || !item.data.x || !item.data.y) return null;

  var data = {
    labels: item.data.x.data.slice(0),
    series: item.data.y.data.slice(0).map(function (serie) {
      return serie.data.slice(0);
    })
  };
  return data;
}

function getExtent(data) {
  var flatDatapoints = (0, _resourcesHelpers.getFlatDatapoints)(data);
  if (flatDatapoints && flatDatapoints.length) {
    return [flatDatapoints[0], flatDatapoints[flatDatapoints.length - 1]];
  }
  return 0;
}

function shortenNumberLabels(config, data) {
  var _getExtent = getExtent(data);

  var _getExtent2 = _slicedToArray(_getExtent, 2);

  var minValue = _getExtent2[0];
  var maxValue = _getExtent2[1];

  var divisor = Math.max(getDivisor(maxValue), getDivisor(Math.abs(minValue)));

  var maxLabel = Math.ceil(maxValue / Math.pow(10, maxValue.length)) * Math.pow(10, maxValue.length);

  var axis = config.horizontalBars ? 'axisX' : 'axisY';

  if (axis === 'axisX') {
    config[axis].scaleMinSpace = (0, _resourcesHelpers.getTextWidth)(maxLabel / divisor, (0, _resourcesSeriesTypes.getDigitLabelFontStyle)()) * 1.5;
  }
  config[axis].labelInterpolationFnc = function (value, index) {
    return value / divisor;
  };
  return divisor;
}

function modifyData(config, item, data, size, rect) {

  if (item.data.x && item.data.x.type) {
    if (_resourcesSeriesTypes.seriesTypes.hasOwnProperty(item.data.x.type.id)) {

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyData) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyData(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyData) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyData(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyData) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyData(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyData) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyData(config, item.data.x.type, data, size, rect);
      }
    }
  }

  if (_resourcesTypes.types[item.type].modifyData) {
    _resourcesTypes.types[item.type].modifyData(config, data, size, rect);
  }
}

function getCombinedChartistConfig(item, data, size, rect) {
  var config = Object.assign((0, _resourcesChartistConfig.getConfig)(item, size), item.chartConfig);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _resourcesTypes.types[item.type].options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var option = _step.value;

      switch (option.type) {
        case 'number':
        case 'oneOf':
        case 'boolean':
        case 'selection':
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

  if (_resourcesTypes.types[item.type].modifyConfig) {
    _resourcesTypes.types[item.type].modifyConfig(config, data, size, rect, item);
  }

  if (item.data.x && item.data.x.type) {
    if (_resourcesSeriesTypes.seriesTypes.hasOwnProperty(item.data.x.type.id)) {

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type, data, size, rect, item);
      }
    }
  }

  (0, _resourcesModifyChartistConfigBeforeRender2['default'])(config, item.type, data, size, rect);

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

function renderChartist(item, element, chartistConfig, dataForChartist) {
  return new _chartist2['default'][_resourcesTypes.types[item.type].chartistType](element, dataForChartist, chartistConfig);
}

function getFormattedDate(date, format, interval) {
  date = (0, _resourcesSeriesTypesDateSeriesType.getDateObject)(date, format);
  return _resourcesSeriesTypesDateConfigPerInterval.seriesTypeConfig[interval].format(0, false, date, true);
}

function getLegendHtml(item) {
  var highlightDataSeries = item.options && item.options.highlightDataSeries;
  var hasHighlighted = !isNaN(highlightDataSeries);
  var isDate = item.data.x.type && item.data.x.type.id === 'date';
  var hasPrognosis = isDate && item.data.x.type.options && !isNaN(item.data.x.type.options.prognosisStart);
  var svgBox = '\n    <svg width="12" height="12">\n      <line x1="1" y1="11" x2="11" y2="1" />\n    </svg>';
  var isLine = item.type === 'Line';
  var itemBox = isLine ? svgBox : '';
  var html = '\n    <div class="q-chart__legend ' + (hasHighlighted ? 'q-chart__legend--highlighted' : '') + ' q-chart__legend--' + item.type.toLowerCase() + '">';
  if (hasPrognosis || item.data && item.data.y && item.data.y.data && item.data.y.data.length) {
    if (item.data.y.data.length > 1) {
      for (var i in item.data.y.data) {
        var serie = item.data.y.data[i];
        var isActive = hasHighlighted && highlightDataSeries == i;
        html += '\n        <div class="q-chart__legend__item q-chart__legend__item--' + chars[i] + ' ' + (isActive ? 'q-chart__legend__item--highlighted' : '') + '">\n          <div class="q-chart__legend__item__box q-chart__legend__item__box--' + item.type.toLowerCase() + '">' + itemBox + '</div>\n          <div class="q-chart__legend__item__text">' + serie.label + '</div>\n        </div>';
      }
    }
    if (hasPrognosis) {
      var _item$data$x$type$options = item.data.x.type.options;
      var prognosisStart = _item$data$x$type$options.prognosisStart;
      var interval = _item$data$x$type$options.interval;

      var date = getFormattedDate(item.data.x.data[prognosisStart], item.data.x.type.config.format, interval);
      html += '\n        <div class="q-chart__legend__item q-chart__legend__item--prognosis">\n          <div class="q-chart__legend__item__box ' + (isLine ? 'q-chart__legend__item__box--line' : '') + '">' + itemBox + '</div>\n          <div class="q-chart__legend__item__text">Prognose (ab ' + date + ')</div>\n        </div>';
    }
  }
  html += '\n    </div>\n  ';
  return html;
}

function getDivisor(maxValue) {
  var divisor = 1;
  if (!maxValue || maxValue === 0) {
    return divisor;
  }

  if (maxValue >= Math.pow(10, 9)) {
    divisor = Math.pow(10, 9);
  } else if (maxValue >= Math.pow(10, 6)) {
    divisor = Math.pow(10, 6);
  } else if (maxValue >= Math.pow(10, 4)) {
    divisor = Math.pow(10, 3);
  }
  return divisor;
}

function getDivisorString(divisor) {
  var divisorString = '';
  switch (divisor) {
    case Math.pow(10, 9):
      divisorString = ' (Mrd.)';
      break;
    case Math.pow(10, 6):
      divisorString = ' (Mio.)';
      break;
    case Math.pow(10, 3):
      divisorString = ' (Tsd.)';
      break;
    default:
      divisorString = '';
      break;
  }
  return divisorString;
}

function wrapEmojisInSpan(text) {
  text = text.replace(/([\ud800-\udbff])([\udc00-\udfff])/g, '<span class="emoji">$&</span>');
  return text;
}

function getContextHtml(item, chartistConfig) {
  var axisExplanation = { x: '', y: '' };
  axisExplanation.y = getDivisorString(chartistConfig.yValueDivisor);

  var html = '<h3 class="q-item__title">' + wrapEmojisInSpan(item.title) + '</h3>';
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  var axisNames = new Array('y', 'x');
  if (chartistConfig.horizontalBars) {
    axisNames.reverse();
  }

  html += '<div class="q-chart__label-y-axis">' + (item.data[axisNames[0]].label || '') + axisExplanation[axisNames[0]] + '</div>';

  if (item.data.x && item.data.x.type && item.data.x.type.id === 'date') {
    if (chartistConfig.horizontalBars) {
      html += '<div class="q-chart__label-x-axis">' + (item.data[axisNames[1]].label || '') + axisExplanation[axisNames[1]] + '</div>';
    }
    html += '<div class="q-chart__chartist-container"></div>';
  } else {
    if (chartistConfig.horizontalBars) {
      html += '\n        <div class="q-chart__label-x-axis">' + (item.data[axisNames[1]].label || '') + axisExplanation[axisNames[1]] + '</div>\n        <div class="q-chart__chartist-container"></div>\n      ';
    } else {
      html += '\n        <div class="q-chart__chartist-container"></div>\n        <div class="q-chart__label-x-axis">' + (item.data[axisNames[1]].label || '') + axisExplanation[axisNames[1]] + '</div>\n      ';
    }
  }

  html += '\n    <div class="q-item__footer">';

  if (item.notes) {
    html += '<div class="q-item__footer__notes">' + item.notes + '</div>';
  }

  html += '<div class="q-item__footer__sources">';
  if (item.sources && item.sources.length && item.sources.length > 0 && item.sources[0].text && item.sources[0].text.length > 0) {
    var sources = item.sources.filter(function (source) {
      return source.text && source.text.length > 0;
    });

    html += 'Quelle' + (sources.length > 1 ? 'n' : '') + ': ';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = sources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var source = _step2.value;

        if (source.href && source.href.length > 0 && source.validHref) {
          html += '<a href="' + source.href + '" target="_blank">' + source.text + '</a>' + (sources.indexOf(source) !== sources.length - 1 ? ', ' : ' ');
        } else {
          html += '' + source.text + (sources.indexOf(source) !== sources.length - 1 ? ', ' : ' ');
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
  } else {
    html += 'Quelle: nicht angegeben';
  }
  html += '</div></div>';
  return html;
}

function displayWithContext(item, element, chartistConfig, dataForChartist) {
  var el = document.createElement('section');
  el.setAttribute('class', 'q-chart');
  el.innerHTML = getContextHtml(item, chartistConfig);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.appendChild(el);
  return renderChartist(item, el.querySelector('.q-chart__chartist-container'), chartistConfig, dataForChartist);
}

function displayWithoutContext(item, element, chartistConfig, dataForChartist) {
  return renderChartist(item, element, chartistConfig, dataForChartist);
}

function display(item, element, rendererConfig) {
  var withoutContext = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  return new Promise(function (resolve, reject) {
    try {
      var _ret = (function () {
        if (!element) throw 'Element is not defined';
        if (!_chartist2['default'].hasOwnProperty(types[item.type].chartistType)) throw 'Chartist Type (' + types[item.type].chartistType + ') not available';

        if (!item.data || !item.data.x) {
          reject('no data');
          return {
            v: undefined
          };
        }

        if (rendererConfig && typeof rendererConfig === 'object') {
          rendererConfig = Object.assign({}, _rendererConfigDefaults2['default'], rendererConfig);
        } else {
          rendererConfig = _rendererConfigDefaults2['default'];
        }

        var rendererPromises = [];

        if (rendererConfig.loadStyles) {
          (function () {
            var themeUrl = rendererConfig.themeUrl || rendererConfig.rendererBaseUrl + 'themes/' + rendererConfig.theme;
            var themeLoadCSS = (0, _fgLoadcss2['default'])(themeUrl + '/styles.css');
            var themeLoadPromise = new Promise(function (resolve, reject) {
              (0, _resourcesOnloadCSS2['default'])(themeLoadCSS, function () {
                resolve();
              });
            });
            rendererPromises.push(themeLoadPromise);
          })();
        }

        var chart = undefined;

        var lastWidth = undefined;

        sizeObserver.onResize(function (rect) {

          if (rect.width && lastWidth === rect.width) {
            return;
          }

          lastWidth = rect.width;

          var dataForChartist = getChartDataForChartist(item);
          if (!dataForChartist || dataForChartist === null) {
            reject('data could not be prepared for chartist');
            return;
          }

          var drawSize = getElementSize(rect);
          var chartistConfig = getCombinedChartistConfig(item, dataForChartist, drawSize, rect);
          chartistConfig.yValueDivisor = shortenNumberLabels(chartistConfig, dataForChartist);

          modifyData(chartistConfig, item, dataForChartist, drawSize, rect);

          (0, _resourcesSetYAxisOffset2['default'])(chartistConfig, item.type, dataForChartist);

          try {
            if (withoutContext) {
              chart = displayWithoutContext(item, element, chartistConfig, dataForChartist);
            } else {
              chart = displayWithContext(item, element, chartistConfig, dataForChartist);
            }
          } catch (e) {
            reject(e);
          }

          chart.supportsForeignObject = false;

          if (chart && chart.on) {
            chart.on('created', function () {
              resolve({
                graphic: chart,
                promises: rendererPromises
              });
            });
          } else {
            reject(chart);
          }
        }, element, true);
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (e) {
      reject(e);
    }
  });
}