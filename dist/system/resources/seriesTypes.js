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
              modifyData: dateHandlers.modifyDataBasedOnPrecisionAndAvailableSpace
            },
            'Bar': {
              modifyData: dateHandlers.modifyDataBasedOnPrecision
            },
            'StackedBar': {
              modifyData: dateHandlers.modifyDataBasedOnPrecision
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});