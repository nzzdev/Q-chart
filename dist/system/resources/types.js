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
            modifyConfig: function modifyConfig(config, value, data, size, rect) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.reverseData = true;
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;

                config.axisX.showGrid = true;
                config.axisX.position = 'start';
                config.axisY.showGrid = false;
              } else {
                config.reverseData = false;
                config.height = chartHeight;

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
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;

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
                config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

                config.axisX.showGrid = true;
                config.axisX.position = 'start';
                config.axisY.showGrid = false;
              } else {
                config.reverseData = false;
                config.height = chartHeight;

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
                config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

                config.axisX.showGrid = true;
                config.axisX.position = 'start';
                config.axisY.showGrid = false;
              } else {
                config.reverseData = false;
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