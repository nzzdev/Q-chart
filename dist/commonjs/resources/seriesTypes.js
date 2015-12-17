'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _seriesTypesDateSeriesType = require('./seriesTypes/dateSeriesType');

var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyData: _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace
      },
      'Bar': {
        modifyData: function modifyData(config, typeOptions, data, size, rect) {
          if (config.horizontalBars) {
            (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, typeOptions, data, size, rect);
          } else {
            (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, typeOptions, data, size, rect);
          }
        }
      },
      'StackedBar': {
        modifyData: function modifyData(config, typeOptions, data, size, rect) {
          if (config.horizontalBars) {
            (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, typeOptions, data, size, rect);
          } else {
            (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, typeOptions, data, size, rect);
          }
        }
      }
    }
  }
};
exports.seriesTypes = seriesTypes;