'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dateConfigPerPrecision = require('./dateConfigPerPrecision');

var dateHandlers = {

  basedOnPrecisionAndAvailableSpace: function basedOnPrecisionAndAvailableSpace(config, typeOptions, data, size, rect) {
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
        data.currentLabels[index] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(label));
      });
    } else {
      data.labels.map(function (label, index) {
        if (_dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].getForceShow(index, data.labels.length, data, config, size)) {
          ticks[index] = label;
          data.currentLabels[index] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(label));
        } else {
          data.currentLabels[index] = ' ';
        }
      });
    }

    config.axisX.labelInterpolationFnc = function (value, index) {
      if (ticks[index]) {
        if (_dateConfigPerPrecision.seriesTypeConfig.hasOwnProperty(typeOptions.precision)) {
          value = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(value));
        }
      } else {
        value = ' ';
      }
      return value;
    };
  },

  basedOnPrecision: function basedOnPrecision(config, typeOptions, data, size, rect) {
    if (!config.horizontalBars) {
      for (var i = 0; i < data.labels.length; i++) {
        data.currentLabels[i] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(i, new Date(data.labels[i]));
      }
      config.axisX.labelInterpolationFnc = function (value, index) {
        if (_dateConfigPerPrecision.seriesTypeConfig.hasOwnProperty(typeOptions.precision)) {
          value = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(value));
        }
        return value;
      };
    } else {
      for (var i = 0; i < data.labels.length; i++) {
        data.currentLabels[i] = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].format(new Date(data.labels[i]));
      }
      config.axisY.labelInterpolationFnc = function (value, index) {
        value = _dateConfigPerPrecision.seriesTypeConfig[typeOptions.precision].format(new Date(value));
        return value;
      };
    }
  }
};
exports.dateHandlers = dateHandlers;