System.register(['./seriesTypes/dateXLarge', './seriesTypes/dateHandlers'], function (_export) {
  'use strict';

  var modifyConfigDateXLarge, dateHandlers, seriesTypes;
  return {
    setters: [function (_seriesTypesDateXLarge) {
      modifyConfigDateXLarge = _seriesTypesDateXLarge.modifyConfigDateXLarge;
    }, function (_seriesTypesDateHandlers) {
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