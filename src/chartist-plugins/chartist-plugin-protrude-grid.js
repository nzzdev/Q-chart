// plugin to protrude gridlines lap over baselines
// inspired by this one https://github.com/gionkunz/chartist-js/issues/493

import Chartist from 'chartist';

var protrude = 4;

var defaultOptions = {
};

export function ctProtrudeGrid(options) {

  options = Object.assign(defaultOptions, options);

  return function ctProtrudeGrid(chart) {
    if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

      var theGrid = [];

      chart.on('created', function(data) {

        /*
        var svg = document.getElementsByTagName('svg');
        console.log(svg);
        */

        theGrid = document.getElementsByClassName('ct-grid');
        //console.log(theGrid);

        for (var i = 0; i < theGrid.length; i++) {
          var gridline = theGrid[i];

          //console.log(gridline.getAttribute('x1'));
          //console.log(gridline.getAttribute('class'));

          
          if(gridline.getAttribute('class') === 'ct-grid ct-horizontal' || gridline.getAttribute('class') === 'ct-grid ct-horizontal ct-baseline'){

            console.log(gridline);

            console.log("horz");
            console.log(JSON.stringify(gridline.getAttribute('y1')));
            console.log(JSON.stringify(gridline.getAttribute('y2')));

            var tempY1 = gridline.getAttribute('y1') - protrude;
            var tempY2 = gridline.getAttribute('y2') + protrude;

            gridline.setAttribute('y1', tempY1);
            gridline.setAttribute('y2', tempY2);

            console.log("----");
            console.log(JSON.stringify(gridline.getAttribute('y1')));
            console.log(JSON.stringify(gridline.getAttribute('y2')));
            //debugger;

            

          } else if (gridline.getAttribute('class') === 'ct-grid ct-vertical' || gridline.getAttribute('class') === 'ct-grid ct-vertical ct-baseline'){

            console.log(gridline);

            //console.log("vert");   
            //console.log(gridline);


            var tempX1 = gridline.getAttribute('x1') - protrude;
            var tempX2 = gridline.getAttribute('x2') + protrude;

            gridline.setAttribute('x1', tempX1);
            gridline.setAttribute('x2', tempX2);

            

          }
          //console.log("--")
        }
      });
      theGrid.length = 0;   
    };
  };
};
