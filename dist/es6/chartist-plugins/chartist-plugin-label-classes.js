import Chartist from 'chartist';

var defaultOptions = {
  first: 'first',
  last: 'last'
};

export function ctLabelClasses(options) {

  options = Object.assign(defaultOptions, options);

  return function ctLabelClasses(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      chart.on('draw', function(data) {   
        if(data.type === 'label') {

          var labelDirection = data.axis.units.dir;

          // Add classname to first label in an axis
          if (data.index === 0) {
            data.element.querySelector('.ct-label:last-child').addClass('ct-' + labelDirection + '-' + options.first);
          }
          
          // Add classname to last label in an axis
          if (data.index === data.axis.ticks.length - 1) {
            data.element.querySelector('.ct-label:last-child').addClass('ct-' + labelDirection + '-' + options.last);
          }
        }
      });
    }
  };
};
