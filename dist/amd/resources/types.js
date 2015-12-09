define(['exports', './chartistConfig'], function (exports, _chartistConfig) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
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
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;
          } else {
            config.height = _chartistConfig.chartHeight;
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
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;
          } else {
            config.height = _chartistConfig.chartHeight;
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
});