System.register([], function (_export) {
  'use strict';

  var dateSettingsForPrecisions, seriesTypes;
  function pad(value, toLength) {
    value = value.toString();
    while (toLength - value.toString().length > 0) {
      value = '0' + value;
    }
    return value;
  }

  function modifyConfigDateXLarge(config, typeOptions, data, size, rect) {
    if (config.horizontalBars) {
      if (config.axisX && config.axisX.labelInterpolationFnc) {
        delete config.axisX.labelInterpolationFnc;
      }
      return;
    }

    var ticks = new Array(data.labels.length);

    config.axisX = config.axisX || {};

    var labels = data.labels.map(function (label, index) {
      return {
        space: dateSettingsForPrecisions[typeOptions.precision].getLabelLength(index, data.labels.length, data, config),
        positionFactor: dateSettingsForPrecisions[typeOptions.precision].getPositionFactor(index, data.labels.length, data, config),
        forceShow: dateSettingsForPrecisions[typeOptions.precision].getForceShow(index, data.labels.length, data, config)
      };
    });

    var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

    var enoughSpace = labels.reduce(function (sum, label) {
      return sum + label.space;
    }, 0) < xAxisWidth;

    if (enoughSpace) {

      labels.map(function (label, index) {
        return ticks[index] = label;
      });
    } else {
      (function () {

        var numberOfLabels = data.labels.length;
        var tickDistance = xAxisWidth / labels.length;

        labels.map(function (label, index) {
          if (label.forceShow) {
            ticks[index] = label;
          }
        });

        labels.map(function (label, index) {
          if (!label.forceShow) {
            var spaceIsFree = true;
            var spaceToTickStart = (index + 1) * tickDistance - label.positionFactor * label.space;
            var i = index;
            while (i--) {
              var endOfLastTick = 0;
              if (ticks[i]) {
                var _endOfLastTick = i * tickDistance + ticks[i].positionFactor * ticks[i].space;
                if (_endOfLastTick > spaceToTickStart) {
                  spaceIsFree = false;
                }
              }
            }
            i = index;
            while (i++ <= labels.length) {
              var startOfNextTick = labels.length * tickDistance;
              if (ticks[i]) {
                var _startOfNextTick = i * tickDistance - ticks[i].positionFactor * ticks[i].space;
                if (_startOfNextTick < spaceToTickStart + label.positionFactor * label.space) {
                  spaceIsFree = false;
                }
              }
            }
            if (spaceIsFree) {
              ticks[index] = label;
            }
          }
        });
      })();
    }

    config.axisX.labelInterpolationFnc = function (value, index) {
      if (dateSettingsForPrecisions.hasOwnProperty(typeOptions.precision)) {
        value = dateSettingsForPrecisions[typeOptions.precision].format(index, new Date(value));
      }

      if (ticks[index]) {
        return value;
      }
    };
  }

  return {
    setters: [],
    execute: function () {
      dateSettingsForPrecisions = {
        year: {
          format: function format(index, date) {
            if (index === 0) {
              return date.getFullYear();
            } else {
              return date.getFullYear().toString().slice(2);
            }
          },
          getLabelLength: function getLabelLength(index, length, data, config) {
            return index === 0 ? 40 : 23;
          },
          getPositionFactor: function getPositionFactor(index, length, data, config) {
            return index === 0 ? 1 : 0.5;
          },
          getForceShow: function getForceShow(index, length, data, config) {
            return index === 0 || index === length - 1;
          }
        },
        month: {
          format: function format(index, date) {
            if (index === 0 || date.getMonth() === 0) {
              return pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
            } else {
              return '' + pad(date.getMonth() + 1, 2);
            }
          },
          getLabelLength: function getLabelLength(index, length, data, config) {
            var date = new Date(data.labels[index]);
            if (index === 0 || date.getMonth() === 0) {
              return 60;
            }
            return 23;
          },
          getPositionFactor: function getPositionFactor(index, length, data, config) {
            return index === 0 || index === length - 1 ? 1 : 0.5;
          },
          getForceShow: function getForceShow(index, length, data, config) {
            var date = new Date(data.labels[index]);
            return index === 0 || index === length - 1 || date.getMonth() === 0;
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
          getLabelLength: function getLabelLength(index, length, data, config) {
            return index === 0 ? 100 : 23;
          },
          getPositionFactor: function getPositionFactor(index, length, data, config) {
            return index === 0 ? 1 : 0.5;
          },
          getForceShow: function getForceShow(index, length, data, config) {
            return index === 0 || index === length - 1;
          }
        },
        hour: {
          format: function format(index, date) {
            return pad(date.getHours() + 1, 2) + ':' + pad(date.getMinutes(), 2);
          },
          getLabelLength: function getLabelLength(index, length, data, config) {
            return 40;
          },
          getPositionFactor: function getPositionFactor(index, length, data, config) {
            return index === 0 ? 1 : 0.5;
          },
          getForceShow: function getForceShow(index, length, data, config) {
            return index === 0 || index === length - 1;
          }
        }
      };
      seriesTypes = {
        'date': {
          'x': {
            'large': {
              modifyConfig: modifyConfigDateXLarge
            }
          }
        }
      };

      _export('seriesTypes', seriesTypes);
    }
  };
});