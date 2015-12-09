define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctProtrudeGrid = ctProtrudeGrid;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var protrude = 80;

  var gridOffsetVert;
  var gridOffsetHorz;

  var defaultOptions = {};

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('draw', function (data) {

          if (data.type === 'grid') {

            console.log("test");

            var lineDirection = data.axis.units.dir;

            if (lineDirection == 'vertical') {

              data.x1 -= protrude;
              data.x2 += protrude;
            } else if (lineDirection == 'horizontal') {

                data.y1 -= protrude;
                data.y2 += protrude;
              }
          }
        });
      };
    };
  }

  ;
});