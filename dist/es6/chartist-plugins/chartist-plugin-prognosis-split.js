import Chartist from 'chartist';

export function ctPrognosisSplit(options) {

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

    let defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    let pattern = defs
      .elem('pattern', {
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
    })
    return defs;
  }

  return function ctPrognosisSplit(chart) {

    if (chart instanceof Chartist.Line ) {

        chart.on('draw', function(data) {
          if (data.type !== 'line') {
            return;
          }

          // if the prognosis starts at the last element, we do nothing
          if (data.path.pathElements.length === options.prognosisStart) {
            return;
          }

          let pathElement = data.element._node;
          let commands = data.element._node.getAttribute('d').split(/(?=[LMC])/);
          
          let beforePrognosisElements = data.path.pathElements.slice(0, options.prognosisStart + 1);

          let lastBeforePrognosis = beforePrognosisElements[beforePrognosisElements.length - 1];

          let prognosisElements  = data.path.pathElements.slice(options.prognosisStart + 1);

          let pathBeforePrognosis = new Chartist.Svg.Path();
          let pathPrognosis = new Chartist.Svg.Path();

          // prognosis path needs to start at the last non prognosis point, so we move it there first
          pathPrognosis.move(lastBeforePrognosis.x, lastBeforePrognosis.y);
          
          pathBeforePrognosis.pathElements = beforePrognosisElements;
          pathPrognosis.pathElements = pathPrognosis.pathElements.concat(prognosisElements);

          let linePrognosis = data.element.parent().elem('path', {
            d: pathPrognosis.stringify()
          }, data.element._node.getAttribute('class') + ' ' + options.lineClassNames.prognosis, true);

          let lineBeforePrognosis = data.element.parent().elem('path', {
            d: pathBeforePrognosis.stringify()
          }, data.element._node.getAttribute('class'), true);

          data.element.parent()._node.removeChild(data.element._node)
        });

      } else if (chart instanceof Chartist.Bar) {

        chart.on('draw', function(data) {
          if (data.type !== 'bar') {
            return;
          }

          let isPrognosis = options.hasSwitchedAxisCount ? data.index <= data.series.length - options.prognosisStart - 1 : data.index >= options.prognosisStart;
          
          // if it is a prognosis, we add a second element with the pattern that covers the original bar line
          if (isPrognosis) {
            let patternLine = data.element
              .parent()
              .elem(data.element._node.cloneNode(true))
            
            patternLine._node.setAttribute('class','');
            patternLine._node.style.stroke = `url(#${options.pattern.name})`;
          }
        });

        chart.on('created', function (data) {
          createPattern(data);
        })

      }

  }

};
