import Chartist from 'chartist';

export function ctPrognosisSplit(options) {

  var defaultOptions = {
    threshold: 0,
    lineClassNames: {
      prognosis: 'ct-chart-line--prognosis'
    },
    barClassNames: {
      prognosis: 'ct-chart-bar--prognosis'
    },
    patternNames: {
      prognosis: 'prognosis-pattern'
    }
  };
  options = Chartist.extend({}, defaultOptions, options);

  function createPattern(data, id) {

    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    let patternSize = 5;
    let pattern = defs
      .elem('pattern', {
        x: 0,
        y: 0,
        width: patternSize,
        height: patternSize,
        id: options.patternNames.prognosis,
        patternUnits: 'userSpaceOnUse'
      });
    pattern.elem('path', {
      'd': 'M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z',
      'stroke-width': 1,
      'stroke': '#FFF',
      'stroke-opacity': 0.5
    })
    return defs;
  }

  return function ctPrognosisSplit(chart) {

    var id = new Date().getTime();

    if (chart instanceof Chartist.Line ) {

        chart.on('draw', function (data) {
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

          pathPrognosis.move(lastBeforePrognosis.x, lastBeforePrognosis.y);
          
          pathBeforePrognosis.pathElements = beforePrognosisElements;
          pathPrognosis.pathElements = pathPrognosis.pathElements.concat(prognosisElements);

          let linePrognosis = data.element.parent().elem('path', {
            d: pathPrognosis.stringify()
          }, chart.options.classNames.line + ' ' + options.lineClassNames.prognosis, true);

          let lineBeforePrognosis = data.element.parent().elem('path', {
            d: pathBeforePrognosis.stringify()
          }, chart.options.classNames.line, true);

          

          data.element.parent()._node.removeChild(data.element._node)
        });

      } else if (chart instanceof Chartist.Bar) {

        chart.on('draw', function (data,i) {
          if (data.type !== 'bar') {
            return;
          }

          let isPrognosis = options.hasSwitchedAxisCount ? data.index <= data.series.length - options.index - 1 : data.index >= options.index;
          
          // if it is a prognosis, we add a second element with the pattern that covers the original bar line
          if (isPrognosis) {
            let patternLine = data.element
              .parent()
              .elem(data.element._node.cloneNode(true))
            
            patternLine._node.setAttribute('class','');
            patternLine._node.style.stroke = `url(#${options.patternNames.prognosis})`;
          }
        });

        chart.on('created', function (data) {
          createPattern(data, id);
        })

      }

  }

};
