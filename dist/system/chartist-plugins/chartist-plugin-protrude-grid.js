System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, protrude, defaultOptions;

  _export('ctProtrudeGrid', ctProtrudeGrid);

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
        chart.on('draw', function (data) {
          if (data.type === 'grid') {
            if (data.axis.counterUnits.dir === "vertical") {

              console.log(data);

              var tempY1 = data.y1;
              var tempY2 = data.y2;
              data.y1 = tempY1 - protrude;
              data.y2 = tempY2 + protrude;
            } else if (data.axis.counterUnits.dir === "horizontal") {
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
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      protrude = 14;
      defaultOptions = {};
      ;
    }
  };
});