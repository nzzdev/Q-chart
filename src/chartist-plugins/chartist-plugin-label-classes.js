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
          var indexClass = '';
          
          // add classname to first label in an axis
          if (data.index === 0) {
            indexClass = 'ct-' + labelDirection + '-' + options.first;
          }
          
          // add classname to last label in an axis
          if (data.index === data.axis.ticks.length - 1) {
            indexClass = 'ct-' + labelDirection + '-' + options.last;
          }

          // add classname with the type of data for x axis
          var typeClass = '';
          if (data.axis.units.pos === 'x') {
            if (chart.options.qItem && chart.options.qItem.data.x.type && chart.options.qItem.data.x.type.id) {
              typeClass = `ct-label--type-${chart.options.qItem.data.x.type.id}`;
            }
          }

          if (data.element._node.nodeName === 'text') {
            data.element.addClass(indexClass)
            data.element.addClass(typeClass)
          } else {
            data.element.querySelector('.ct-label:last-child').addClass(indexClass);
            data.element.querySelector('.ct-label:last-child').addClass(typeClass);
          }
        }
      });
    }
  };
};
