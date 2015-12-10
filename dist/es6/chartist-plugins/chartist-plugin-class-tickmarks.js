// plugin to class gridlines for highlighting baseline
// found it here https://github.com/gionkunz/chartist-js/issues/493
// ATTENTION! does not work on IE because oc lineClassList, check the link
// ATTENTION! data.element._node.lastChild.classList works with foreignElement

import Chartist from 'chartist';

var defaultOptions = {
  first: 'first',
  last: 'last'
};

// Chartist.plugins = Chartist.plugins || {};

export function ctExtendTickmmarksClassNames(options) {

  options = Object.assign(defaultOptions, options);

  return function ctExtendTickmmarksClassNames(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      chart.on('draw', function(data) {   
        if(data.type === 'label') {

          var labelIndex = data.index;
          var labelClassList = data.element._node.lastChild.classList;
          var labelDirection = data.axis.units.dir;

          //console.log(data.axis.ticks.length);
          // console.log(data);

          // Add classname to first label in an axis
          if (labelIndex === 0) {
            labelClassList.add('ct-' + labelDirection + '-' + options.first);
          }

          
          // Add classname to last label in an axis
          if (labelIndex === data.axis.ticks.length - 1) {
            labelClassList.add('ct-' + labelDirection + '-' + options.last);
          }
        }
      });
    }
  };
};
