System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, protrude, gridOffsetVert, gridOffsetHorz, defaultOptions;

  _export('ctProtrudeGrid', ctProtrudeGrid);

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

        chart.on('draw', function (data) {

          if (data.type === 'grid') {

            console.log("test");
            debugger;

            var lineDirection = data.axis.units.dir;

            if (lineDirection == 'vertical') {

              data.x1 -= protrude;
              data.x2 += protrude;

              debugger;
            } else if (lineDirection == 'horizontal') {

              data.y1 -= protrude;
              data.y2 += protrude;

              debugger;
            }
          }
        });
      };
    };
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      protrude = 80;
      defaultOptions = {};
      ;
    }
  };
});