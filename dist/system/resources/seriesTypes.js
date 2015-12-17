System.register(['./seriesTypes/dateSeriesType'], function (_export) {
  'use strict';

  var setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval, seriesTypes;
  return {
    setters: [function (_seriesTypesDateSeriesType) {
      setLabelsBasedOnIntervalAndAvailableSpace = _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace;
      setLabelsBasedOnInterval = _seriesTypesDateSeriesType.setLabelsBasedOnInterval;
    }],
    execute: function () {
      seriesTypes = {
        'date': {
          'x': {
            'Line': {
              modifyData: setLabelsBasedOnIntervalAndAvailableSpace
            },
            'Bar': {
              modifyData: function modifyData(config, typeOptions, data, size, rect) {
                if (config.horizontalBars) {
                  setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect);
                }
              }
            },
            'StackedBar': {
              modifyData: function modifyData(config, typeOptions, data, size, rect) {
                if (config.horizontalBars) {
                  setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect);
                }
              }
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});