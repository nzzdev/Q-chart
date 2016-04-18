import Chartist from 'chartist';

var defaultOptions = {
  first: 'first',
  last: 'last'
};

export function ctLabelClasses(options) {

  options = Object.assign(defaultOptions, options);

  return function ctLabelClasses(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      
      chart.on('created', function(data) {
        var horizontalLabels = data.svg.querySelectorAll('.ct-label.ct-horizontal');
        var verticalLabels = data.svg.querySelectorAll('.ct-label.ct-vertical');

        if (horizontalLabels && horizontalLabels.svgElements.length > 0) {
          addClass(horizontalLabels.svgElements[0], 'ct-horizontal--' + options.first);
          addClass(horizontalLabels.svgElements[horizontalLabels.svgElements.length - 1], 'ct-horizontal--' + options.last);
        }

        if (verticalLabels && verticalLabels.svgElements.length > 0) {
          addClass(verticalLabels.svgElements[0], 'ct-vertical--' + options.first);
          addClass(verticalLabels.svgElements[verticalLabels.svgElements.length - 1], 'ct-vertical--' + options.last);
        }
      });

    }
  };
};

function addClass(element, additionalClass) {
  if (element._node.nodeName === 'text') {
    element.addClass(additionalClass);
  } else {
    element.querySelector('.ct-label:last-child').addClass(additionalClass);
  }
}
