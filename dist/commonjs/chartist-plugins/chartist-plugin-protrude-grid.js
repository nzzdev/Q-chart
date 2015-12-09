'use strict';

Object.defineProperty(exports, '__esModule', {
              value: true
});
exports.ctProtrudeGrid = ctProtrudeGrid;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var protrude = 80;

var gridOffsetVert;
var gridOffsetHorz;

var defaultOptions = {};

function ctProtrudeGrid(options) {

              options = Object.assign(defaultOptions, options);

              return function ctProtrudeGrid(chart) {
                            if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {

                                          chart.on('draw', function (data) {

                                                        if (data.type === 'grid') {

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