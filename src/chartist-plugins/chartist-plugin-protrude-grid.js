// plugin to protrude gridlines lap over baselines
// inspired by this one https://github.com/gionkunz/chartist-js/issues/493

import Chartist from 'chartist';

var protrude = 14;

var defaultOptions = {
};

export function ctProtrudeGrid(options) {

  options = Object.assign(defaultOptions, options);

  return function ctProtrudeGrid(chart) {

    // check type of chart
    if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

      // when element gets? drawn
      chart.on('data', function(data) {

        console.log(data);

        // check for gridlines
        if (data.type === 'grid') {

          // get vertical gridlines
          if (data.axis.counterUnits.dir === "vertical") {

            console.log(data);

          // offset vertical gridlines and set new values
            var tempY1 = data.y1;
            var tempY2 = data.y2;
            data.y1 = tempY1 - protrude;
            data.y2 = tempY2 + protrude;

          // get horizontal gridlines
          } else if (data.axis.counterUnits.dir === "horizontal") {

          // offset horizontal gridlines and set new values
            var tempX1 = data.x1;
            var tempX2 = data.x2;
            data.x1 = tempX1 - protrude;
            data.x2 = tempX2 + protrude;

          }

        }

      });
    };
  };

   debugger;

};
