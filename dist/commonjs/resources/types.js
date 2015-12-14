'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _chartistConfig = require('./chartistConfig');

var types = {
  Bar: {
    label: 'Bar',
    chartistType: 'Bar',
    options: [{
      name: 'isColumnChart',
      type: 'oneOf',
      labels: ['Säulen', 'Balken'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        config.horizontalBars = !value;
        if (config.horizontalBars) {
          config.reverseData = true;
          config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.reverseData = false;
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
          config.reverseData = true;
          config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.reverseData = false;
        }
      }
    }]
  },
  StackedBar: {
    label: 'Stacked Bar',
    chartistType: 'Bar',
    options: [{
      name: 'isColumnChart',
      type: 'oneOf',
      labels: ['Säulen', 'Balken'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, data, size, rect) {
        config.horizontalBars = !value;
        if (config.horizontalBars) {
          config.reverseData = true;
          config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.reverseData = false;
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
          config.reverseData = true;
          config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

          config.axisX.showGrid = true;
          config.axisX.position = 'start';
          config.axisY.showGrid = false;
        } else {
          config.reverseData = true;
        }
      }
    }]
  },
  Line: {
    label: 'Line',
    chartistType: 'Line',
    options: []
  }
};
exports.types = types;