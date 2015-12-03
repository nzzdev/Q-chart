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

                                                                                    var lineDirection = data.axis.units.dir;

                                                                                    if (lineDirection == 'vertical') {
                                                                                                  data.axis.gridOffset = data.axis.chartRect.x1 - protrude;
                                                                                    } else if (lineDirection == 'horizontal') {
                                                                                                                data.axis.gridOffset = data.axis.chartRect.y2 - protrude;
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
                                          protrude = 8;
                                          defaultOptions = {};
                                          ;
                            }
              };
});