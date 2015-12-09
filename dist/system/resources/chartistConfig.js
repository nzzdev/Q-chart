System.register(['../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-grid-on-top.js', '../chartist-plugins/chartist-plugin-class-tickmarks.js', '../chartist-plugins/chartist-plugin-fit-bars.js'], function (_export) {
  'use strict';

  var ctExtendGridClassNames, ctGridOnTop, ctExtendTickmmarksClassNames, ctExtendFitBarsToData, vertBarHeight, vertBarSetPadding, chartHeight, chartistConfigs;

  _export('getConfig', getConfig);

  function getConfig(type, size, data) {
    var config = chartistConfigs[type][size];

    return config;
  }

  return {
    setters: [function (_chartistPluginsChartistPluginClassAxisJs) {
      ctExtendGridClassNames = _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames;
    }, function (_chartistPluginsChartistPluginGridOnTopJs) {
      ctGridOnTop = _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop;
    }, function (_chartistPluginsChartistPluginClassTickmarksJs) {
      ctExtendTickmmarksClassNames = _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames;
    }, function (_chartistPluginsChartistPluginFitBarsJs) {
      ctExtendFitBarsToData = _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData;
    }],
    execute: function () {
      vertBarHeight = 10;

      _export('vertBarHeight', vertBarHeight);

      vertBarSetPadding = 22;

      _export('vertBarSetPadding', vertBarSetPadding);

      chartHeight = 200;

      _export('chartHeight', chartHeight);

      chartistConfigs = {

        Bar: {
          small: {
            height: chartHeight,
            seriesBarDistance: 11,
            chartPadding: {
              top: 0,
              right: 1,
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop()]
          },
          large: {
            height: chartHeight,
            fullWidth: true,
            seriesBarDistance: 11,
            chartPadding: {
              top: 0,
              right: 1,
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop(), ctExtendFitBarsToData()]
          }
        },

        StackedBar: {
          small: {
            height: chartHeight,
            seriesBarDistance: 11,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            reverseData: false,
            horizontalBars: true,
            stackBars: true,
            axisX: {
              showGrid: true,
              position: 'start'
            },
            axisY: {
              showGrid: false
            },
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop()]
          },
          large: {
            height: chartHeight,
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
            stackBars: true,
            axisX: {
              showGrid: false,
              position: 'end'
            },
            axisY: {
              showGrid: true
            },
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop(), ctExtendFitBarsToData()]
          }
        },

        Line: {
          small: {
            height: chartHeight,

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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop()]
          },
          large: {
            height: chartHeight,

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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctGridOnTop()]
          }
        }
      };

      _export('chartistConfigs', chartistConfigs);
    }
  };
});