System.register(['../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-protrude-grid.js'], function (_export) {
  'use strict';

  var ctExtendGridClassNames, ctProtrudeGrid, vertBarHeight, vertBarSetPadding, chartistConfigs;

  _export('default', getConfig);

  function getConfig(type, size, data) {
    var config = chartistConfigs[type][size];

    if (data.series.length * data.labels.length >= 30) {
      console.log("+++ uh, more than 30 bars, better switch to mobile layout on desktop +++");
    }

    if (type === 'bar' && size === 'small') {
      config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
    }
    return config;
  }

  return {
    setters: [function (_chartistPluginsChartistPluginClassAxisJs) {
      ctExtendGridClassNames = _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames;
    }, function (_chartistPluginsChartistPluginProtrudeGridJs) {
      ctProtrudeGrid = _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid;
    }],
    execute: function () {
      vertBarHeight = 10;
      vertBarSetPadding = 22;
      chartistConfigs = {

        bar: {
          small: {
            height: 200,
            seriesBarDistance: 11,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            reverseData: false,
            horizontalBars: true,
            axisX: {
              showGrid: true,
              position: 'start'
            },
            axisY: {
              showGrid: false
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid()]
          },
          large: {
            height: 200,
            fullWidth: true,
            seriesBarDistance: 11,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            reverseData: false,
            horizontalBars: false,
            axisX: {
              showGrid: false,
              position: 'end'
            },
            axisY: {
              showGrid: true
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid()]
          }
        },

        line: {
          small: {
            height: 200,

            showPoint: false,
            lineSmooth: false,
            axisX: {
              showGrid: true,
              showLabel: true
            },
            axisY: {
              position: 'start',
              scaleMinSpace: 40
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid()]
          },
          large: {
            height: 200,

            showPoint: false,
            lineSmooth: false,
            axisX: {
              showGrid: true,
              showLabel: true
            },
            axisY: {
              position: 'start',
              scaleMinSpace: 40
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid()]
          }
        }
      };
    }
  };
});