define(['exports', './seriesTypes/dateHandlers'], function (exports, _seriesTypesDateHandlers) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var seriesTypes = {
    'date': {
      'x': {
        'Line': {
          modifyData: _seriesTypesDateHandlers.dateHandlers.modifyDataBasedOnPrecisionAndAvailableSpace
        },
        'Bar': {
          modifyData: _seriesTypesDateHandlers.dateHandlers.modifyDataBasedOnPrecision
        },
        'StackedBar': {
          modifyData: _seriesTypesDateHandlers.dateHandlers.modifyDataBasedOnPrecision
        }
      }
    }
  };
  exports.seriesTypes = seriesTypes;
});