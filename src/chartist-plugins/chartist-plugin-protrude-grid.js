// plugin to protrude gridlines lap over baselines
// inspired by this on https://github.com/gionkunz/chartist-js/issues/493

import Chartist from 'chartist';

var protrude = 8;

var gridOffsetVert;
var gridOffsetHorz;

var defaultOptions = {

};

export function ctProtrudeGrid(options) {

  options = Object.assign(defaultOptions, options);

  return function ctProtrudeGrid(chart) {
    if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

      console.log(chart);
//                debugger;

      chart.on('draw', function(data) {



          /*

          */

          if(data.type === 'grid') {

//                    data.axis.gridOffset = protrude;
//          console.log(data);
//                    debugger;

          /*
          data.axis.chartRect.x1 -= protrude;
          data.axis.chartRect.x2 += protrude;
          data.axis.chartRect.y1 -= protrude;
          data.axis.chartRect.y2 += protrude;  
          */

          /*
          data.axis.chartRect.x1 = 40;
          data.axis.chartRect.x2 = 615;
          data.axis.chartRect.y1 = 175;
          data.axis.chartRect.y2 = 5;  
          */
//                    data.axis.chartRect.padding.left = 0;
//                    data.axis.chartRect.padding.top = 0;
//
//                    data.axis.gridOffset = 0;
//                    debugger;
/*                      
              console.log('x1: ' + JSON.stringify(data.x1));
              console.log('x2: ' + JSON.stringify(data.x2));

              console.log('y1: ' + JSON.stringify(data.y1));
              console.log('y2: ' + JSON.stringify(data.y2));
*/
              

              var lineDirection = data.axis.units.dir;

              if (lineDirection == 'vertical'){
//                  console.log("--vert--");   
                  data.axis.gridOffset = data.axis.chartRect.x1 - protrude;  
// -->                           data.axis.chartRect.x2 = data.axis.chartRect.x2 + protrude*2;
//                            data.x2 = data.axis.chartRect.x2 + protrude*2;
//                            data.axis.axisLength = data.axis.chartRect.y1 - data.axis.chartRect.y2 + (protrude*2);
//                            data.axis.axisLength = 595;                 
//                            data.x1 -= protrude;
//                            data.x2 = 625;
//                          console.log("");  
              } else if (lineDirection == 'horizontal'){
//                  console.log("--horz--");    
                 data.axis.gridOffset = data.axis.chartRect.y2 - protrude; 
// -->                          data.axis.chartRect.y2 = data.axis.chartRect.y2 + protrude*2;
//                           data.axis.axisLength = data.axis.chartRect.x2 - data.axis.chartRect.x1 + (protrude*2);
//                            data.axis.axisLength = 190;                 
//                            data.y1 -= protrude;
//                            data.y2 = 185;
//                          console.log(""); 
              }

//debugger;

             
/*
              console.log('x1 new: ' + JSON.stringify(data.x1));
              console.log('x2 new: ' + JSON.stringify(data.x2));

              console.log('y1 new: ' + JSON.stringify(data.y1));
              console.log('y2 new: ' + JSON.stringify(data.y2));
*/
          }

      //debugger;
          
      });
    };
  };
};
