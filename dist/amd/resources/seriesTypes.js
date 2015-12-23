define(['exports', './seriesTypes/dateSeriesType', 'chartist'], function (exports, _seriesTypesDateSeriesType, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var getLabelFontStyle = function getLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '11px Arial';
    } else {
      return '13px Arial';
    }
  };

  exports.getLabelFontStyle = getLabelFontStyle;
  var getDigitLabelFontStyle = function getDigitLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '10px Lucida Sans Typewriter';
    } else {
      return '12px Lucida Sans Typewriter';
    }
  };

  exports.getDigitLabelFontStyle = getDigitLabelFontStyle;
  var seriesTypes = {
    'date': {
      'x': {
        'Line': {
          modifyData: _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace
        },
        'Bar': {
          modifyData: function modifyData(config, type, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, type, data, size, rect);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, type, data, size, rect, getLabelFontStyle());
            }
          }
        },
        'StackedBar': {
          modifyData: function modifyData(config, type, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, type, data, size, rect);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, type, data, size, rect, getLabelFontStyle());
            }
          }
        }
      }

    }
  };
  exports.seriesTypes = seriesTypes;
});