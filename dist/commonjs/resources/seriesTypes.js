'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _seriesTypesDateHandlers = require('./seriesTypes/dateHandlers');

var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyConfig: _seriesTypesDateHandlers.dateHandlers.basedOnPrecisionAndAvailableSpace
      },
      'Bar': {
        modifyConfig: _seriesTypesDateHandlers.dateHandlers.basedOnPrecision
      },
      'StackedBar': {
        modifyConfig: _seriesTypesDateHandlers.dateHandlers.basedOnPrecision
      }
    }
  }
};
exports.seriesTypes = seriesTypes;