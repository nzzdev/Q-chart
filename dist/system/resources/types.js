System.register([], function (_export) {
  'use strict';

  var vertBarHeight, vertBarSetPadding, types;
  return {
    setters: [],
    execute: function () {
      vertBarHeight = 10;
      vertBarSetPadding = 22;
      types = {
        Bar: {
          label: 'Bar',
          chartistType: 'Bar',
          options: [{
            name: 'isColumnChart',
            type: 'oneOf',
            labels: ['columns', 'bars'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size, data) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
              }
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'boolean',
            label: 'forceBarsOnSmall',
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size, data) {
              if (value && size === 'small') {
                config.horizontalBars = true;
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
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
            modifyConfig: function modifyConfig(config, value, size, data) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
              }
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'boolean',
            label: 'forceBarsOnSmall',
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size, data) {
              if (value && size === 'small') {
                config.horizontalBars = true;
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
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

      _export('types', types);
    }
  };
});