define(['exports', './dateConfigPerPrecision'], function (exports, _dateConfigPerPrecision) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var dateHandlers = {

    modifyDataBasedOnPrecisionAndAvailableSpace: function modifyDataBasedOnPrecisionAndAvailableSpace(config, typeOptions, data, size, rect) {
      var ticks = new Array(data.labels.length);

      config.axisX = config.axisX || {};

      var labels = data.labels.map(function (label, index) {
        return {
          space: _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].getLabelLengthBasedOnIndex(index, data.labels.length, data, config)
        };
      });

      var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

      var enoughSpace = labels.reduce(function (sum, label) {
        return sum + label.space;
      }, 0) < xAxisWidth;

      if (enoughSpace) {
        data.labels.map(function (label, index) {
          ticks[index] = label;
          data.labels[index] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
        });
      } else {
        data.labels.map(function (label, index) {
          if (_dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].getForceShow(index, data.labels.length, data, config, size)) {
            ticks[index] = label;
            data.labels[index] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
          } else {
            data.labels[index] = ' ';
          }
        });
      }
    },

    modifyDataBasedOnPrecision: function modifyDataBasedOnPrecision(config, typeOptions, data, size, rect) {
      if (!config.horizontalBars) {
        for (var i = 0; i < data.labels.length; i++) {
          data.labels[i] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(i, data.labels.length, new Date(data.labels[i].toString()));
        }
      } else {
        for (var i = 0; i < data.labels.length; i++) {
          data.labels[i] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].format(new Date(data.labels[i].toString()));
        }
      }
    }
  };
  exports.dateHandlers = dateHandlers;
});