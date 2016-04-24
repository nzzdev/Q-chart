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
      lineClassNames: {
        prognosis: 'ct-chart-line--prognosis'
      },
      classNames: {
        nonePrognosis: 'none-prognosis',
        prognosis: 'ct-chart-line--prognosis'
      },
      patternNames: {
        nonePrognosis: 'none-prognosis-pattern',
        prognosis: 'prognosis-pattern'
      }
    };
    options = _Chartist['default'].extend({}, defaultOptions, options);

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
          if (data.type === 'line') {

            var pathElement = data.element._node;
            var commands = data.element._node.getAttribute('d').split(/(?=[LMC])/);

            var beforePrognosisElements = data.path.pathElements.slice(0, options.prognosisStart + 1);

            var lastBeforePrognosis = beforePrognosisElements[beforePrognosisElements.length - 1];

            var prognosisElements = data.path.pathElements.slice(options.prognosisStart + 1);

            var pathBeforePrognosis = new _Chartist['default'].Svg.Path();
            var pathPrognosis = new _Chartist['default'].Svg.Path();

            pathPrognosis.move(lastBeforePrognosis.x, lastBeforePrognosis.y);

            pathBeforePrognosis.pathElements = beforePrognosisElements;
            pathPrognosis.pathElements = pathPrognosis.pathElements.concat(prognosisElements);

            var lineBeforePrognosis = chart.svg.elem('path', {
              d: pathBeforePrognosis.stringify()
            }, chart.options.classNames.line, true);

            var linePrognosis = chart.svg.elem('path', {
              d: pathPrognosis.stringify()
            }, chart.options.classNames.line, true);

            linePrognosis.addClass(options.lineClassNames.prognosis);

            var _parent = _Chartist['default'].Svg(data.element._node.parentNode);
            _parent.append(lineBeforePrognosis);
            _parent.append(linePrognosis);

            data.element._node.parentElement.removeChild(data.element._node);
          }
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