define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctProtrudeGrid = ctProtrudeGrid;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var protrude = 14;

  var defaultOptions = {};

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {
        chart.on('data', function (data) {

          console.log(data);

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

  ;
});