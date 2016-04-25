System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist;

  _export('ctPrognosisSplit', ctPrognosisSplit);

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
    options = Chartist.extend({}, defaultOptions, options);

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

      if (chart instanceof Chartist.Line) {

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

          var prognosisElements = data.path.pathElements.slice(options.prognosisStart + 1);

          var pathBeforePrognosis = new Chartist.Svg.Path();
          var pathPrognosis = new Chartist.Svg.Path();

          pathPrognosis.move(lastBeforePrognosis.x, lastBeforePrognosis.y);

          pathBeforePrognosis.pathElements = beforePrognosisElements;
          pathPrognosis.pathElements = pathPrognosis.pathElements.concat(prognosisElements);

          var linePrognosis = data.element.parent().elem('path', {
            d: pathPrognosis.stringify()
          }, data.element._node.getAttribute('class') + ' ' + options.lineClassNames.prognosis, true);

          var lineBeforePrognosis = data.element.parent().elem('path', {
            d: pathBeforePrognosis.stringify()
          }, data.element._node.getAttribute('class'), true);

          data.element.parent()._node.removeChild(data.element._node);
        });
      } else if (chart instanceof Chartist.Bar) {

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

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      ;
    }
  };
});