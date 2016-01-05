'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getDivisorString = getDivisorString;
exports.display = display;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('core-js/es6/object');

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _resourcesChartistConfig = require('./resources/chartistConfig');

var _resourcesSizeObserver = require('./resources/SizeObserver');

var _resourcesSizeObserver2 = _interopRequireDefault(_resourcesSizeObserver);

var _resourcesTypes = require('./resources/types');

var _resourcesSeriesTypes = require('./resources/seriesTypes');

var _resourcesHelpers = require('./resources/helpers');

var _resourcesModifyChartistConfigBeforeRender = require('./resources/modifyChartistConfigBeforeRender');

require('./styles.css!');

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

function shortenNumberLabels(config, data) {
  if (!data.series.length || data.series[0].length === 0) {
    return 1;
  }
  var divisor = 1;
  var flatDatapoints = data.series.reduce(function (a, b) {
    return a.concat(b);
  }).filter(function (cell) {
    return !isNaN(parseFloat(cell));
  }).slice(0).sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });

  var maxValue = flatDatapoints[flatDatapoints.length - 1];

  if (maxValue >= Math.pow(10, 9)) {
    divisor = Math.pow(10, 9);
  } else if (maxValue >= Math.pow(10, 6)) {
    divisor = Math.pow(10, 6);
  } else if (maxValue >= Math.pow(10, 4)) {
    divisor = Math.pow(10, 3);
  }

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

function modifyDataBasedOnSeriesType(config, item, data, size, rect) {
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

  if (_resourcesTypes.types[item.type].modifyConfig) {
    _resourcesTypes.types[item.type].modifyConfig(config, data, size, rect);
  }

  if (item.data.x && item.data.x.type) {
    if (_resourcesSeriesTypes.seriesTypes.hasOwnProperty(item.data.x.type.id)) {

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type, data, size, rect);
      }

      if (_resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type] && _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
        _resourcesSeriesTypes.seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type, data, size, rect);
      }
    }
  }

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

function renderChartist(item, element, chartistConfig, dataForChartist) {
  return new _chartist2['default'][_resourcesTypes.types[item.type].chartistType](element, dataForChartist, chartistConfig);
}

function getLegendHtml(item) {
  var html = '\n    <div class="q-chart__legend">';
  if (item.data && item.data.y && item.data.y.data && item.data.y.data.length && item.data.y.data.length > 1) {
    for (var i in item.data.y.data) {
      var serie = item.data.y.data[i];
      html += '\n        <div class="q-chart__legend__item q-chart__legend__item--' + chars[i] + '">\n          <div class="q-chart__legend__item__box"></div>\n          <div class="q-chart__legend__item__text">' + serie.label + '</div>\n        </div>';
    }
  }
  html += '\n    </div>\n  ';
  return html;
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

  var html = '<h3 class="q-chart__title">' + wrapEmojisInSpan(item.title) + '</h3>';
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  var axisNames = new Array('y', 'x');
  if (chartistConfig.horizontalBars) {
    axisNames.reverse();
  }

  html += '<div class="q-chart__label-y-axis">' + (item.data[axisNames[0]].label || '') + axisExplanation[axisNames[0]] + '</div>';

  if (item.data.x.type.id === 'date') {
    html += '<div class="q-chart__chartist-container"></div>';
  } else {
    if (chartistConfig.horizontalBars) {
      html += '\n        <div class="q-chart__label-x-axis">' + (item.data[axisNames[1]].label || '') + axisExplanation[axisNames[1]] + '</div>\n        <div class="q-chart__chartist-container"></div>\n      ';
    } else {
      html += '\n        <div class="q-chart__chartist-container"></div>\n        <div class="q-chart__label-x-axis">' + (item.data[axisNames[1]].label || '') + axisExplanation[axisNames[1]] + '</div>\n      ';
    }
  }

  html += '  \n    <div class="q-chart__footer">';

  if (item.notes) {
    html += '<div class="q-chart__footer__notes">' + item.notes + '</div>';
  }

  html += '<div class="q-chart__footer__sources">';
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
          html += '<a href="' + source.href + '">' + source.text + '</a> ';
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

function display(item, element) {
  var withoutContext = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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

        var chart = undefined;

        sizeObserver.onResize(function (rect) {
          var dataForChartist = getChartDataForChartist(item);
          if (!dataForChartist || dataForChartist === null) {
            reject('data could not be prepared for chartist');
            return;
          }

          var drawSize = getElementSize(rect);
          var chartistConfig = getCombinedChartistConfig(item, dataForChartist, drawSize, rect);
          chartistConfig.yValueDivisor = shortenNumberLabels(chartistConfig, dataForChartist);
          modifyDataBasedOnSeriesType(chartistConfig, item, dataForChartist, drawSize, rect);

          if (withoutContext) {
            chart = displayWithoutContext(item, element, chartistConfig, dataForChartist);
          } else {
            chart = displayWithContext(item, element, chartistConfig, dataForChartist);
          }

          chart.supportsForeignObject = false;

          if (chart && chart.on) {
            chart.on('created', function () {
              resolve(chart);
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