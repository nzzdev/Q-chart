System.register(['./chartistConfig', './min'], function (_export) {
  'use strict';

  var vertBarHeight, vertBarSetPadding, chartHeight, min, types;
  return {
    setters: [function (_chartistConfig) {
      vertBarHeight = _chartistConfig.vertBarHeight;
      vertBarSetPadding = _chartistConfig.vertBarSetPadding;
      chartHeight = _chartistConfig.chartHeight;
    }, function (_min) {
      min = _min['default'];
    }],
    execute: function () {
      types = {
        Bar: {
          label: 'Bar',
          chartistType: 'Bar',
          modifyData: function modifyData(config, data, size, rect) {
            if (config.horizontalBars) {
              data.labels.reverse();
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
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;

                config.axisX.showGrid = true;
                config.axisX.position = 'start';
                config.axisY.showGrid = false;
              } else {
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
                config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;

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
          options: [{
            name: 'isColumnChart',
            type: 'oneOf',
            labels: ['Säulen', 'Balken'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, data, size, rect) {
              config.horizontalBars = !value;
              if (config.horizontalBars) {
                config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

                config.axisX.showGrid = true;
                config.axisX.position = 'start';
                config.axisY.showGrid = false;
              } else {
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
                config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

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
            var minValue = min(data.series.map(function (serie) {
              return min(serie.map(function (datapoint) {
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

      _export('types', types);
    }
  };
});