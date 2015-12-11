// plugin to protrude gridlines lap over baselines
// inspired by this one https://github.com/gionkunz/chartist-js/issues/493

import Chartist from 'chartist';

var defaultOptions = {
  protrude: 5,
};

export function ctProtrudeGrid(options) {

  options = Object.assign(defaultOptions, options);

  return function ctProtrudeGrid(chart) {

    // check type of chart
    if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

      chart.on('draw', function(data) {

        // check for gridlines
        if (data.type === 'grid') {

          // get vertical gridlines
          if (data.axis.counterUnits.dir === "vertical") {

            data.element._node.setAttribute('y1', parseInt(data.element._node.getAttribute('y1')) - options.protrude);
            data.element._node.setAttribute('y2', parseInt(data.element._node.getAttribute('y2')) + options.protrude);

          // get horizontal gridlines
          } else if (data.axis.counterUnits.dir === "horizontal") {

            // offset horizontal gridlines and set new values
            data.element._node.setAttribute('x1', parseInt(data.element._node.getAttribute('x1')) - options.protrude);
            data.element._node.setAttribute('x2', parseInt(data.element._node.getAttribute('x2')) + options.protrude);

          }

        }

      });
    };
  };

   debugger;

};
