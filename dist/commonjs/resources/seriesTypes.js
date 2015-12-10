'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _seriesTypesDateXLarge = require('./seriesTypes/dateXLarge');

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