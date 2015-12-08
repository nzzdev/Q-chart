define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  function pad(value, toLength) {
    value = value.toString();
    while (toLength - value.toString().length > 0) {
      value = '0' + value;
    }
    return value;
  }

  var dateSettingsForPrecisions = {
    year: {
      format: function format(index, date) {
        if (index === 0) {
          return date.getFullYear();
        } else {
          return date.getFullYear().toString().slice(2);
        }
      },
      getLabelLength: function getLabelLength(index) {
        return index === 0 ? 100 : 20;
      }
    },
    month: {
      format: function format(index, date) {
        if (index === 0) {
          return pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
        } else {
          return '' + pad(date.getMonth() + 1, 2);
        }
      },
      getLabelLength: function getLabelLength(index) {
        return index === 0 ? 100 : 20;
      }
    },
    day: {
      format: function format(index, date) {
        if (index === 0) {
          return pad(date.getDate(), 2) + '.' + pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
        } else {
          return '' + pad(date.getDate(), 2);
        }
      },
      getLabelLength: function getLabelLength(index) {
        return index === 0 ? 100 : 20;
      }
    },
    hour: {
      format: function format(index, date) {
        return pad(date.getHours() + 1, 2) + ':' + pad(date.getMinutes(), 2);
      },
      getLabelLength: function getLabelLength(index) {
        return 40;
      }
    }
  };

  function modifyConfigDateX(config, typeOptions, data, size, rect) {
    config.axisX = config.axisX || {};

    var labels = data.labels.map(function (label, index) {
      return {
        space: dateSettingsForPrecisions[typeOptions.precision].getLabelLength(index)
      };
    });

    var xAxisWidth = rect.width - ((config.axisY.offset || 0) + 10);

    var enoughSpace = labels.reduce(function (sum, label) {
      return sum + label.space;
    }, 0) < xAxisWidth;

    if (enoughSpace) {

      labels.map(function (label) {
        return label.show = true;
      });
    } else {
      (function () {

        var numberOfLabels = data.labels.length;
        var spacePerLabel = xAxisWidth / labels.length;

        labels.map(function (label, index) {
          var spaceNeededBefore = 0;
          var i = index;
          while (i--) {
            if (labels[i]) {
              spaceNeededBefore = spaceNeededBefore + (labels[i].show ? labels[i].space : 0);
            }
          }
          if (spaceNeededBefore < (index + 1) * spacePerLabel) {
            label.show = true;
          } else {
            label.show = false;
          }
        });
      })();
    }

    config.axisX.labelInterpolationFnc = function (value, index) {
      if (dateSettingsForPrecisions.hasOwnProperty(typeOptions.precision)) {
        value = dateSettingsForPrecisions[typeOptions.precision].format(index, new Date(value));
      }

      if (labels[index].show) {
        return value;
      }
      return ' ';
    };
  }

  var seriesTypes = {
    'date': {
      'x': {
        modifyConfig: modifyConfigDateX
      }
    }
  };
  exports.seriesTypes = seriesTypes;
});