System.register([], function (_export) {
  'use strict';

  var dateFormatForPrecisions, seriesTypes;
  function pad(value, toLength) {
    value = value.toString();
    while (toLength - value.toString().length > 0) {
      value = '0' + value;
    }
    return value;
  }

  return {
    setters: [],
    execute: function () {
      dateFormatForPrecisions = {
        year: function year(index, date) {
          if (index === 0) {
            return date.getFullYear();
          } else {
            return date.getFullYear().toString().slice(2);
          }
        },
        month: function month(index, date) {
          if (index === 0) {
            return pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
          } else {
            return '' + pad(date.getMonth() + 1, 2);
          }
        },
        day: function day(index, date) {
          if (index === 0) {
            return pad(date.getDate(), 2) + '.' + pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
          } else {
            return '' + pad(date.getDate(), 2);
          }
        }
      };
      seriesTypes = {
        'date': {
          'x': {
            modifyConfig: function modifyConfig(config, typeOptions, data, size, rect) {

              config.axisX = config.axisX || {};
              config.axisX.labelInterpolationFnc = function (value, index) {
                var xAxisWidth = rect.width - ((config.axisY.offset || 0) + 10);

                if (dateFormatForPrecisions.hasOwnProperty(typeOptions.precision)) {
                  value = dateFormatForPrecisions[typeOptions.precision](index, new Date(value));
                }

                return value;
              };
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});