System.register(['./seriesTypes/dateHandlers'], function (_export) {
  'use strict';

  var dateHandlers, seriesTypes;
  return {
    setters: [function (_seriesTypesDateHandlers) {
      dateHandlers = _seriesTypesDateHandlers.dateHandlers;
    }],
    execute: function () {
      seriesTypes = {
        'date': {
          'x': {
            'Line': {
              modifyConfig: dateHandlers.basedOnPrecisionAndAvailableSpace
            },
            'Bar': {
              modifyConfig: dateHandlers.basedOnPrecision
            },
            'StackedBar': {
              modifyConfig: dateHandlers.basedOnPrecision
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});