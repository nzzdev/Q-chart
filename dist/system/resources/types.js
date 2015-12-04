System.register(['./chartistConfig'], function (_export) {
  'use strict';

  var vertBarHeight, vertBarSetPadding, chartHeight, types;
  return {
    setters: [function (_chartistConfig) {
      vertBarHeight = _chartistConfig.vertBarHeight;
      vertBarSetPadding = _chartistConfig.vertBarSetPadding;
      chartHeight = _chartistConfig.chartHeight;
    }],
    execute: function () {
      types = {
        Bar: {
          label: 'Bar',
          chartistType: 'Bar',
          options: [{
            name: 'isColumnChart',
            type: 'oneOf',
            labels: ['Säulen', 'Balken'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size, data) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
              } else {
                config.height = chartHeight;
              }
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'boolean',
            label: 'Balken für Mobile',
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
            labels: ['Säulen', 'Balken'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size, data) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
              } else {
                config.height = chartHeight;
              }
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'boolean',
            label: 'Balken für Mobile',
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