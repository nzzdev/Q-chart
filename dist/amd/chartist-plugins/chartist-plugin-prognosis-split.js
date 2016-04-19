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
      },
      patternNames: {
        nonePrognosis: 'none-prognosis-pattern',
        prognosis: 'prognosis-pattern'
      }
    };
    options = _Chartist['default'].extend({}, defaultOptions, options);

    function createMasks(data, options, id) {

      var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
      var width = data.svg.width();
      var height = data.svg.height();
      var childNodes = data.svg._node.childNodes;

      var gridGroup = childNodes[0];
      var elementsGroup = childNodes[1];

      var _gridGroup$getBoundingClientRect = gridGroup.getBoundingClientRect();

      var top = _gridGroup$getBoundingClientRect.top;
      var bottom = _gridGroup$getBoundingClientRect.bottom;

      var elements = elementsGroup.querySelectorAll('*');
      var origTop = top;
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

    function createPattern(data, id) {

      var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
      var pttrnSize = 5;
      var pattrn = defs.elem('pattern', {
        x: 0,
        y: 0,
        width: pttrnSize,
        height: pttrnSize,
        id: options.patternNames.prognosis + id,
        patternUnits: 'userSpaceOnUse'
      });
      pattrn.elem('path', {
        'd': 'M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z',
        'stroke-width': 1,
        'stroke': '#FFF',
        'stroke-opacity': 0.5
      });
      return defs;
    }

    return function ctPrognosisSplit(chart) {

      var id = new Date().getTime();

      if (chart instanceof _Chartist['default'].Line) {

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
      } else if (chart instanceof _Chartist['default'].Bar) {

        chart.on('draw', function (data, i) {
          if (data.type !== 'bar') {
            return;
          }
          var isPrognosis = options.hasSwitchedAxisCount ? data.index <= data.series.length - options.index - 1 : data.index >= options.index;
          if (isPrognosis) {
            data.element.parent().elem(data.element._node.cloneNode(true)).addClass(options.classNames.prognosis)._node.style.stroke = 'url(#' + options.patternNames.prognosis + id + ')';
          } else {
            data.element.addClass(options.classNames.nonePrognosis);
          }
        });

        chart.on('created', function (data) {
          createPattern(data, id);
        });
      }
    };
  }

  ;
});