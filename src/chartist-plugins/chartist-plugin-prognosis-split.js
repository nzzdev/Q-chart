import Chartist from 'chartist';

export function ctPrognosisSplit(options) {

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
  options = Chartist.extend({}, defaultOptions, options);

  function createMasks(data, options, id) {

    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    var width = data.svg.width();
    var height = data.svg.height();
    let {childNodes} = data.svg._node;
    let gridGroup = childNodes[0];
    let elementsGroup = childNodes[1];
    let {top,bottom} = gridGroup.getBoundingClientRect();
    let elements = elementsGroup.querySelectorAll('*');
    let origTop = top;
    for (var i = 0; i < elements.length; i++) {
      let elRect = elements[i].getBoundingClientRect();
      top = Math.min(top, elRect.top);
      bottom = Math.max(bottom, elRect.bottom);
    }
    height = bottom - top + 10;
    var y = (top - origTop);
    var chartWidth = data.chartRect.width();
    var borderLeft = width - chartWidth;
    var projectedThreshold = options.threshold * chartWidth;

    // Create mask for part left from threshold
    defs
      .elem('mask', {
        x: 0,
        y: y,
        width: width,
        height: height,
        id: options.maskNames.nonePrognosis + id
      })
      .elem('rect', {
        x: borderLeft,
        y: y,
        width: projectedThreshold,
        height: height,
        fill: 'white'
      });

    // Create mask for part right from threshold
    defs
      .elem('mask', {
        x: 0,
        y: y,
        width: width,
        height: height,
        id: options.maskNames.prognosis + id
      })
      .elem('rect', {
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
    let pttrnSize = 5;
    let pattrn = defs
      .elem('pattern', {
        x: 0,
        y: 0,
        width: pttrnSize,
        height: pttrnSize,
        id: options.patternNames.prognosis + id,
        patternUnits: 'userSpaceOnUse'
      });
    pattrn.elem('path', {
      'd':'M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z',
      'stroke-width':1,
      'stroke':'#FFF',
      'stroke-opacity':0.5
    })
    return defs;
  }

  return function ctPrognosisSplit(chart) {

    var id = new Date().getTime();

    if (chart instanceof Chartist.Line ) {

        chart.on('draw', function (data) {
          if (data.type === 'point') {
            // For points we can just use the data value and compare against the threshold in order to determine
            // the appropriate class
            data.element.addClass(
              data.value.x >= options.threshold ? options.classNames.nonePrognosis : options.classNames.prognosis
            );
          } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {
            // Cloning the original line path, mask it with the upper mask rect above the threshold and add the
            // class for above threshold
            data.element
              .parent()
              .elem(data.element._node.cloneNode(true))
              .attr({
                mask: 'url(#' + options.maskNames.nonePrognosis + id + ')'
              })
              .addClass(options.classNames.nonePrognosis);

            // Use the original line path, mask it with the lower mask rect below the threshold and add the class
            // for blow threshold
            data.element
              .attr({
                mask: 'url(#' + options.maskNames.prognosis + id + ')'
              })
              .addClass(options.classNames.prognosis);
          }
        });

        // On the created event, create the two mask definitions used to mask the line graphs
        chart.on('created', function (data) {
          createMasks(data, options, id);
        });

      } else if (chart instanceof Chartist.Bar) {

        chart.on('draw', function (data,i) {
          if (data.type !== 'bar') {
            return;
          }
          let isPrognosis = options.hasSwitchedAxisCount ? data.index <= data.series.length - options.index - 1 : data.index >= options.index;
          if (isPrognosis) {
            data.element
              .parent()
              .elem(data.element._node.cloneNode(true))
              .addClass(options.classNames.prognosis)
              ._node.style.stroke = 'url(#' + options.patternNames.prognosis + id + ')';
          } else {
            data.element.addClass(options.classNames.nonePrognosis);
          }
        });

        chart.on('created', function (data) {
          createPattern(data, id);
        })

      }

  }

};
