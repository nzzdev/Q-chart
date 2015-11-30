define(['exports', 'chartist'], function (exports, _chartist) {
              'use strict';

              Object.defineProperty(exports, '__esModule', {
                            value: true
              });
              exports.ctProtrudeGrid = ctProtrudeGrid;

              function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

              var _Chartist = _interopRequireDefault(_chartist);

              var protrude = 8;

              var gridOffsetVert;
              var gridOffsetHorz;

              var defaultOptions = {};

              function ctProtrudeGrid(options) {

                            options = Object.assign(defaultOptions, options);

                            return function ctProtrudeGrid(chart) {
                                          if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

                                                        console.log(chart);

                                                        chart.on('draw', function (data) {

                                                                      if (data.type === 'grid') {
                                                                                    console.log(data);

                                                                                    var lineDirection = data.axis.units.dir;

                                                                                    if (lineDirection == 'vertical') {
                                                                                                  console.log("--vert--");
                                                                                                  data.axis.gridOffset = data.axis.chartRect.x1 - protrude;
                                                                                    } else if (lineDirection == 'horizontal') {
                                                                                                                console.log("--horz--");
                                                                                                                data.axis.gridOffset = data.axis.chartRect.y2 - protrude;
                                                                                                  }
                                                                      }
                                                        });
                                          };
                            };
              }

              ;
});