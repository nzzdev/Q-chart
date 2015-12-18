define(['exports', './seriesTypes/dateSeriesType', './seriesTypes/helpers', 'chartist', './max'], function (exports, _seriesTypesDateSeriesType, _seriesTypesHelpers, _chartist, _max) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var _max2 = _interopRequireDefault(_max);

  var getLabelFontStyle = function getLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '11px Arial';
    } else {
      return '13px Arial';
    }
  };

  var getDigitLabelFontStyle = function getDigitLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '10px Lucida Sans Typewriter';
    } else {
      return '12px Lucida Sans Typewriter';
    }
  };

  var seriesTypes = {
    'date': {
      'x': {
        'Line': {
          modifyData: _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace
        },
        'Bar': {
          modifyData: function modifyData(config, typeOptions, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, typeOptions, data, size, rect, getLabelFontStyle);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, typeOptions, data, size, rect, getLabelFontStyle);
            }
          }
        },
        'StackedBar': {
          modifyData: function modifyData(config, typeOptions, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, typeOptions, data, size, rect, getLabelFontStyle);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, typeOptions, data, size, rect, getLabelFontStyle);
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

          config.axisX.scaleMinSpace = (0, _seriesTypesHelpers.getLabelWidth)(maxLabel / divider, getDigitLabelFontStyle) * 1.5;

          config.axisX.labelInterpolationFnc = function (value, index) {
            return value / divider;
          };
        }
      }
    }
  };
  exports.seriesTypes = seriesTypes;
});