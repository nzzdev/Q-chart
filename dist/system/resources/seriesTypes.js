System.register(['./seriesTypes/dateSeriesType', './seriesTypes/helpers', 'chartist', './max'], function (_export) {
  'use strict';

  var setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval, getLabelWidth, Chartist, max, getLabelFontStyle, getDigitLabelFontStyle, seriesTypes;
  return {
    setters: [function (_seriesTypesDateSeriesType) {
      setLabelsBasedOnIntervalAndAvailableSpace = _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace;
      setLabelsBasedOnInterval = _seriesTypesDateSeriesType.setLabelsBasedOnInterval;
    }, function (_seriesTypesHelpers) {
      getLabelWidth = _seriesTypesHelpers.getLabelWidth;
    }, function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_max) {
      max = _max['default'];
    }],
    execute: function () {
      getLabelFontStyle = function getLabelFontStyle() {
        if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
          return '11px Arial';
        } else {
          return '13px Arial';
        }
      };

      getDigitLabelFontStyle = function getDigitLabelFontStyle() {
        if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
          return '10px Lucida Sans Typewriter';
        } else {
          return '12px Lucida Sans Typewriter';
        }
      };

      seriesTypes = {
        'date': {
          'x': {
            'Line': {
              modifyData: setLabelsBasedOnIntervalAndAvailableSpace
            },
            'Bar': {
              modifyData: function modifyData(config, typeOptions, data, size, rect) {
                if (config.horizontalBars) {
                  setLabelsBasedOnInterval(config, typeOptions, data, size, rect, getLabelFontStyle);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle);
                }
              }
            },
            'StackedBar': {
              modifyData: function modifyData(config, typeOptions, data, size, rect) {
                if (config.horizontalBars) {
                  setLabelsBasedOnInterval(config, typeOptions, data, size, rect, getLabelFontStyle);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle);
                }
              }
            }
          }

        },
        'number': {
          'x': {
            modifyConfig: function modifyConfig(config, typeOptions, data, size, rect) {
              var divider = undefined;

              var flatDatapoints = data.series.reduce(function (a, b) {
                return a.concat(b);
              }).sort(function (a, b) {
                return parseFloat(a) - parseFloat(b);
              });

              var medianValue = flatDatapoints.length % 2 === 0 ? flatDatapoints[flatDatapoints.length / 2 - 1] : flatDatapoints[flatDatapoints.length - 1 / 2];
              var maxValue = flatDatapoints[flatDatapoints.length - 1];

              if (medianValue >= Math.pow(10, 9)) {
                divider = Math.pow(10, 9);
              } else if (medianValue >= Math.pow(10, 6)) {
                divider = Math.pow(10, 6);
              } else if (medianValue >= Math.pow(10, 3)) {
                divider = Math.pow(10, 3);
              }

              var maxLabel = Math.ceil(maxValue / Math.pow(10, maxValue.length)) * Math.pow(10, maxValue.length);

              config.axisX.scaleMinSpace = getLabelWidth(maxLabel / divider, getDigitLabelFontStyle) * 1.5;

              config.axisX.labelInterpolationFnc = function (value, index) {
                return value / divider;
              };
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});