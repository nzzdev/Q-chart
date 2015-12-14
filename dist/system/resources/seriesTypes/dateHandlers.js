System.register(['./dateConfigPerPrecision'], function (_export) {
  'use strict';

  var seriesTypeConfig, dateHandlers;
  return {
    setters: [function (_dateConfigPerPrecision) {
      seriesTypeConfig = _dateConfigPerPrecision.seriesTypeConfig;
    }],
    execute: function () {
      dateHandlers = {

        modifyDataBasedOnPrecisionAndAvailableSpace: function modifyDataBasedOnPrecisionAndAvailableSpace(config, typeOptions, data, size, rect) {
          var ticks = new Array(data.labels.length);

          config.axisX = config.axisX || {};

          var labels = data.labels.map(function (label, index) {
            return {
              space: seriesTypeConfig[typeOptions.precision].getLabelLengthBasedOnIndex(index, data.labels.length, data, config)
            };
          });

          var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

          var enoughSpace = labels.reduce(function (sum, label) {
            return sum + label.space;
          }, 0) < xAxisWidth;

          if (enoughSpace) {
            data.labels.map(function (label, index) {
              ticks[index] = label;
              data.labels[index] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
            });
          } else {
            data.labels.map(function (label, index) {
              if (seriesTypeConfig[typeOptions.precision].getForceShow(index, data.labels.length, data, config, size)) {
                ticks[index] = label;
                data.labels[index] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
              } else {
                data.labels[index] = ' ';
              }
            });
          }
        },

        modifyDataBasedOnPrecision: function modifyDataBasedOnPrecision(config, typeOptions, data, size, rect) {
          if (!config.horizontalBars) {
            for (var i = 0; i < data.labels.length; i++) {
              data.labels[i] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(i, data.labels.length, new Date(data.labels[i].toString()));
            }
          } else {
            for (var i = 0; i < data.labels.length; i++) {
              data.labels[i] = seriesTypeConfig[typeOptions.precision].format(new Date(data.labels[i].toString()));
            }
          }
        }
      };

      _export('dateHandlers', dateHandlers);
    }
  };
});