define(['exports', './seriesTypes/dateXLarge'], function (exports, _seriesTypesDateXLarge) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var seriesTypes = {
    'date': {
      'x': {
        'large': {
          'Line': {
            modifyConfig: _seriesTypesDateXLarge.modifyConfigDateXLarge
          }
        }
      }
    }
  };
  exports.seriesTypes = seriesTypes;
});