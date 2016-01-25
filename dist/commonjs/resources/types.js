'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartistConfig = require('./chartistConfig');

var _min = require('./min');

var _min2 = _interopRequireDefault(_min);

var types = {
  Bar: {
    label: 'Bar',
    chartistType: 'Bar',
    modifyData: function modifyData(config, data, size, rect) {
      if (config.horizontalBars) {
        data.labels.reverse();
        data.series.reverse();
        data.series.map(function (serie) {
          serie.reverse();
        });
      }
    },
    options: [{
      name: 'isColumnChart',
      type: 'oneOf',
      labels: ['Säulen', 'Balken'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        config.horizontalBars = !value;
        if (config.horizontalBars) {
          config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.height = _chartistConfig.chartHeight;

          config.axisX.showGrid = false;
          config.axisX.position = 'end';
        }
      }
    }, {
      name: 'forceBarsOnSmall',
      type: 'boolean',
      label: 'Balken für Mobile',
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        if (value && size === 'small') {
          config.horizontalBars = true;
          config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        }
      }
    }]
  },
  StackedBar: {
    label: 'Stacked Bar',
    chartistType: 'Bar',
    modifyData: function modifyData(config, data, size, rect) {
      if (config.horizontalBars) {
        data.labels.reverse();
        data.series.reverse();
        data.series.map(function (serie) {
          serie.reverse();
        });
      }
    },
    options: [{
      name: 'isColumnChart',
      type: 'oneOf',
      labels: ['Säulen', 'Balken'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        config.horizontalBars = !value;
        if (config.horizontalBars) {
          config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.height = _chartistConfig.chartHeight;

          config.axisX.showGrid = false;
          config.axisX.position = 'end';
        }
      }
    }, {
      name: 'forceBarsOnSmall',
      type: 'boolean',
      label: 'Balken für Mobile',
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        if (value && size === 'small') {
          config.horizontalBars = true;
          config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        }
      }
    }]
  },
  Line: {
    label: 'Line',
    chartistType: 'Line',
    options: [],
    modifyConfig: function modifyConfig(config, data, size, rect) {
      config.low = 0;
      var minValue = (0, _min2['default'])(data.series.map(function (serie) {
        return (0, _min2['default'])(serie.map(function (datapoint) {
          return parseFloat(datapoint);
        }));
      }));

      if (minValue < 0) {
        config.low = minValue;
        return;
      }

      var allFirstHundered = data.series.map(function (serie) {
        return serie[0];
      }).reduce(function (prev, current) {
        return parseInt(current) === 100;
      }, false);
      if (allFirstHundered && minValue >= 100) {
        config.low = 100;
      }

      return;
    }
  }
};
exports.types = types;