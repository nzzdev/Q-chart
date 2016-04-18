'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctPrognosisSplit = ctPrognosisSplit;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctPrognosisSplit(options) {

  var defaultOptions = {
    threshold: 0,
    classNames: {
      nonePrognosis: 'none-prognosis',
      prognosis: 'prognosis'
    },
    maskNames: {
      nonePrognosis: 'none-prognosis-mask',
      prognosis: 'prognosis-mask'
    }
  };
  options = _chartist2['default'].extend({}, defaultOptions, options);

  function createMasks(data, options, id) {

    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    var width = data.svg.width();
    var height = data.svg.height();
    var childNodes = data.svg._node.childNodes;

    var gridsRect = childNodes[0].getBoundingClientRect();
    var top = gridsRect.top;
    var bottom = gridsRect.bottom;

    var origTop = top;
    var elements = childNodes[1].querySelectorAll('*');
    for (var i = 0; i < elements.length; i++) {
      var elRect = elements[i].getBoundingClientRect();
      top = Math.min(top, elRect.top);
      bottom = Math.max(bottom, elRect.bottom);
    }
    height = bottom - top + 10;
    var y = top - origTop;
    var chartWidth = data.chartRect.width();
    var borderLeft = width - chartWidth;
    var projectedThreshold = options.threshold * chartWidth;

    defs.elem('mask', {
      x: 0,
      y: y,
      width: width,
      height: height,
      id: options.maskNames.nonePrognosis + id
    }).elem('rect', {
      x: borderLeft,
      y: y,
      width: projectedThreshold,
      height: height,
      fill: 'white'
    });

    defs.elem('mask', {
      x: 0,
      y: y,
      width: width,
      height: height,
      id: options.maskNames.prognosis + id
    }).elem('rect', {
      x: projectedThreshold + borderLeft,
      y: y,
      width: width - projectedThreshold,
      height: height,
      fill: 'white'
    });

    return defs;
  }

  return function ctPrognosisSplit(chart) {
    if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {

      var id = new Date().getTime();

      chart.on('draw', function (data) {
        if (data.type === 'point') {
          data.element.addClass(data.value.x >= options.threshold ? options.classNames.nonePrognosis : options.classNames.prognosis);
        } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {
          data.element.parent().elem(data.element._node.cloneNode(true)).attr({
            mask: 'url(#' + options.maskNames.nonePrognosis + id + ')'
          }).addClass(options.classNames.nonePrognosis);

          data.element.attr({
            mask: 'url(#' + options.maskNames.prognosis + id + ')'
          }).addClass(options.classNames.prognosis);
        }
      });

      chart.on('created', function (data) {
        createMasks(data, options, id);
      });
    }
  };
}

;