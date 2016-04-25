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
    prognosisStart: 0,
    lineClassNames: {
      prognosis: 'ct-chart-line--prognosis'
    },
    pattern: {
      size: 5,
      strokeWidth: 1,
      strokeOpacity: 0.5,
      strokeColor: '#FFFFFF',
      name: 'prognosis-pattern'
    }
  };
  options = _chartist2['default'].extend({}, defaultOptions, options);

  function createPattern(data) {

    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    var pattern = defs.elem('pattern', {
      x: 0,
      y: 0,
      width: options.pattern.size,
      height: options.pattern.size,
      id: options.pattern.name,
      patternUnits: 'userSpaceOnUse'
    });
    pattern.elem('path', {
      'd': 'M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z',
      'stroke-width': options.strokeWidth,
      'stroke': options.pattern.strokeColor,
      'stroke-opacity': options.strokeOpacity
    });
    return defs;
  }

  return function ctPrognosisSplit(chart) {

    if (chart instanceof _chartist2['default'].Line) {

      chart.on('draw', function (data) {
        if (data.type !== 'line') {
          return;
        }

        if (data.path.pathElements.length === options.prognosisStart) {
          return;
        }

        var pathElement = data.element._node;
        var commands = data.element._node.getAttribute('d').split(/(?=[LMC])/);

        var beforePrognosisElements = data.path.pathElements.slice(0, options.prognosisStart + 1);

        var lastBeforePrognosis = beforePrognosisElements[beforePrognosisElements.length - 1];

        var prognosisElements = data.path.pathElements.splice(options.prognosisStart + 1);

        data.element._node.setAttribute('d', data.path.stringify());

        var pathPrognosis = new _chartist2['default'].Svg.Path();

        pathPrognosis.move(lastBeforePrognosis.x, lastBeforePrognosis.y);

        pathPrognosis.pathElements = pathPrognosis.pathElements.concat(prognosisElements);

        data.element.parent().elem('path', {
          d: pathPrognosis.stringify()
        }, data.element._node.getAttribute('class') + ' ' + options.lineClassNames.prognosis, false);
      });
    } else if (chart instanceof _chartist2['default'].Bar) {

      chart.on('draw', function (data) {
        if (data.type !== 'bar') {
          return;
        }

        var isPrognosis = options.hasSwitchedAxisCount ? data.index <= data.series.length - options.prognosisStart - 1 : data.index >= options.prognosisStart;

        if (isPrognosis) {
          var patternLine = data.element.parent().elem(data.element._node.cloneNode(true));

          patternLine._node.setAttribute('class', '');
          patternLine._node.style.stroke = 'url(#' + options.pattern.name + ')';
        }
      });

      chart.on('created', function (data) {
        createPattern(data);
      });
    }
  };
}

;