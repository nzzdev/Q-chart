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
    }
  };
  options = Chartist.extend({}, defaultOptions, options);

  function createMasks(data, options, el) {

    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    var width = data.svg.width();
    var height = data.svg.height();
    var chartWidth = data.chartRect.width();
    var borderLeft = width - chartWidth;
    var projectedThreshold = options.threshold * chartWidth;

    // Create mask for part left from threshold
    defs
      .elem('mask', {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.nonePrognosis
      })
      .elem('rect', {
        x: borderLeft,
        y: 0,
        width: projectedThreshold,
        height: height,
        fill: 'white'
      });

    // Create mask for part right from threshold
    defs
      .elem('mask', {
        x: 0,
        y: 0,
        width: width,
        height: height,
        id: options.maskNames.prognosis
      })
      .elem('rect', {
        x: projectedThreshold + borderLeft,
        y: 0,
        width: width - projectedThreshold,
        height: height,
        fill: 'white'
      });

    return defs;
  }

  return function ctPrognosisSplit(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

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
                mask: 'url(#' + options.maskNames.nonePrognosis + ')'
              })
              .addClass(options.classNames.nonePrognosis);

            // Use the original line path, mask it with the lower mask rect below the threshold and add the class
            // for blow threshold
            data.element
              .attr({
                mask: 'url(#' + options.maskNames.prognosis + ')'
              })
              .addClass(options.classNames.prognosis);
          }
        });

        // On the created event, create the two mask definitions used to mask the line graphs
        chart.on('created', function (data) {
          createMasks(data, options, chart.element);
        });
      }
  }

};
