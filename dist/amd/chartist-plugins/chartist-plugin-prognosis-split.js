define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctPrognosisSplit = ctPrognosisSplit;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

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
    options = _Chartist['default'].extend({}, defaultOptions, options);

    function createMasks(data, options, el) {

      var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
      var width = data.svg.width();
      var height = data.svg.height();
      var chartWidth = data.chartRect.width();
      var borderLeft = width - chartWidth;
      var projectedThreshold = options.threshold * chartWidth;

      defs.elem('mask', {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.nonePrognosis
      }).elem('rect', {
        x: borderLeft,
        y: 0,
        width: projectedThreshold,
        height: height,
        fill: 'white'
      });

      defs.elem('mask', {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.prognosis
      }).elem('rect', {
        x: projectedThreshold + borderLeft,
        y: 0,
        width: width - projectedThreshold,
        height: height,
        fill: 'white'
      });

      return defs;
    }

    return function ctPrognosisSplit(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('draw', function (data) {
          if (data.type === 'point') {
            data.element.addClass(data.value.x >= options.threshold ? options.classNames.nonePrognosis : options.classNames.prognosis);
          } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {
            data.element.parent().elem(data.element._node.cloneNode(true)).attr({
              mask: 'url(#' + options.maskNames.nonePrognosis + ')'
            }).addClass(options.classNames.nonePrognosis);

            data.element.attr({
              mask: 'url(#' + options.maskNames.prognosis + ')'
            }).addClass(options.classNames.prognosis);
          }
        });

        chart.on('created', function (data) {
          createMasks(data, options, chart.element);
        });
      }
    };
  }

  ;
});