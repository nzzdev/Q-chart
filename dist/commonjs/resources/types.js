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
      labels: ['columns', 'bars'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, size) {
        config.horizontalBars = !value;
      }
    }, {
      name: 'forceBarsOnSmall',
      type: 'oneOf',
      labels: ['columns', 'bars'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, size) {
        if (value && size === 'small') {
          config.horizontalBars = true;
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
      labels: ['columns', 'bars'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, size) {
        config.horizontalBars = !value;
      }
    }, {
      name: 'forceBarsOnSmall',
      type: 'oneOf',
      labels: ['columns', 'bars'],
      defaultValue: true,
      modifyConfig: function modifyConfig(config, value, size) {
        if (value && size === 'small') {
          config.horizontalBars = true;
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