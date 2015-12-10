System.register(['./seriesTypes/dateXLarge'], function (_export) {
  'use strict';

  var modifyConfigDateXLarge, seriesTypes;
  return {
    setters: [function (_seriesTypesDateXLarge) {
      modifyConfigDateXLarge = _seriesTypesDateXLarge.modifyConfigDateXLarge;
    }],
    execute: function () {
      seriesTypes = {
        'date': {
          'x': {
            'large': {
              'Line': {
                modifyConfig: modifyConfigDateXLarge
              }
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});