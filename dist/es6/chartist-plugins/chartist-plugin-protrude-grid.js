// plugin to protrude gridlines lap over baselines
// inspired by this one https://github.com/gionkunz/chartist-js/issues/493

import Chartist from 'chartist';

var protrude = 80;

var gridOffsetVert;
var gridOffsetHorz;

var defaultOptions = {

};

export function ctProtrudeGrid(options) {

  options = Object.assign(defaultOptions, options);

  return function ctProtrudeGrid(chart) {
    if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

      chart.on('draw', function(data) {

          if(data.type === 'grid') {

            console.log("test");
            debugger;

              var lineDirection = data.axis.units.dir;

              if (lineDirection == 'vertical'){
        
                            data.x1 -= protrude;
                            data.x2 += protrude;

                            debugger;

              } else if (lineDirection == 'horizontal'){
               
                            data.y1 -= protrude;
                            data.y2 += protrude;

                            debugger;

              }
          }
      });
    };
  };
};
