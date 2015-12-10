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

  var seriesTypeConfig = {
    year: {
      formatBasedOnIndex: function formatBasedOnIndex(index, date) {
        if (index === 0) {
          return date.getFullYear();
        } else {
          return date.getFullYear().toString().slice(2);
        }
      },
      getLabelLengthBasedOnIndex: function getLabelLengthBasedOnIndex(index, length, data, config) {
        return index === 0 ? 40 : 23;
      },
      format: function format(date) {
        return date.getFullYear();
      },
      getForceShow: function getForceShow(index, length, data, config, size) {
        return index === 0 || index === length - 1;
      }
    },
    month: {
      formatBasedOnIndex: function formatBasedOnIndex(index, date) {
        if (index === 0 || date.getMonth() === 0) {
          return pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
        } else {
          return '' + pad(date.getMonth() + 1, 2);
        }
      },
      getLabelLengthBasedOnIndex: function getLabelLengthBasedOnIndex(index, length, data, config) {
        var date = new Date(data.labels[index]);
        if (index === 0 || date.getMonth() === 0) {
          return 60;
        }
        return 23;
      },
      format: function format(date) {
        return pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
      },
      getForceShow: function getForceShow(index, length, data, config, size) {
        if (size === 'small') {
          return index === 0 || index === length - 1;
        } else {
          var date = new Date(data.labels[index]);
          return index === 0 || index === length - 1 || date.getMonth() === 0;
        }
      }
    },
    day: {
      formatBasedOnIndex: function formatBasedOnIndex(index, date) {
        if (index === 0) {
          return pad(date.getDate(), 2) + '.' + pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
        } else {
          return '' + pad(date.getDate(), 2);
        }
      },
      getLabelLengthBasedOnIndex: function getLabelLengthBasedOnIndex(index, length, data, config) {
        return index === 0 ? 100 : 23;
      },
      format: function format(date) {
        return pad(date.getDate(), 2) + '.' + pad(date.getMonth() + 1, 2) + '.' + date.getFullYear();
      },
      getForceShow: function getForceShow(index, length, data, config, size) {
        return index === 0 || index === length - 1;
      }
    },
    hour: {
      formatBasedOnIndex: function formatBasedOnIndex(index, date) {
        return pad(date.getHours() + 1, 2) + ':' + pad(date.getMinutes(), 2);
      },
      getLabelLengthBasedOnIndex: function getLabelLengthBasedOnIndex(index, length, data, config) {
        return 40;
      },
      format: function format(date) {
        return pad(date.getHours() + 1, 2) + ':' + pad(date.getMinutes(), 2);
      },
      getForceShow: function getForceShow(index, length, data, config, size) {
        return index === 0 || index === length - 1;
      }
    }
  };
  exports.seriesTypeConfig = seriesTypeConfig;
});