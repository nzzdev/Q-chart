System.register(['../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-protrude-grid.js', '../chartist-plugins/chartist-plugin-grid-on-top.js', '../chartist-plugins/chartist-plugin-class-tickmarks.js', '../chartist-plugins/chartist-plugin-fit-bars.js', './clone'], function (_export) {
  'use strict';

  var ctExtendGridClassNames, ctProtrudeGrid, ctGridOnTop, ctExtendTickmmarksClassNames, ctExtendFitBarsToData, clone, vertBarHeight, vertBarSetPadding, chartHeight, chartistConfigs;

  _export('getConfig', getConfig);

  function getConfig(type, size, data) {
    var config = clone(chartistConfigs[type][size]);

    return config;
  }

  return {
    setters: [function (_chartistPluginsChartistPluginClassAxisJs) {
      ctExtendGridClassNames = _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames;
    }, function (_chartistPluginsChartistPluginProtrudeGridJs) {
      ctProtrudeGrid = _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid;
    }, function (_chartistPluginsChartistPluginGridOnTopJs) {
      ctGridOnTop = _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop;
    }, function (_chartistPluginsChartistPluginClassTickmarksJs) {
      ctExtendTickmmarksClassNames = _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames;
    }, function (_chartistPluginsChartistPluginFitBarsJs) {
      ctExtendFitBarsToData = _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData;
    }, function (_clone) {
      clone = _clone['default'];
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop()]
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop(), ctExtendFitBarsToData()]
          }
        },

        StackedBar: {
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
            stackBars: true,
            axisX: {
              showGrid: true,
              position: 'start'
            },
            axisY: {
              showGrid: false
            },
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop()]
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
            stackBars: true,
            axisX: {
              showGrid: false,
              position: 'end'
            },
            axisY: {
              showGrid: true
            },
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop(), ctExtendFitBarsToData()]
          }
        },

        Line: {
          small: {
            height: chartHeight,
            chartPadding: {
              top: 0,
              right: 1,
              bottom: 0,
              left: 0
            },
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop()]
          },
          large: {
            height: chartHeight,
            chartPadding: {
              top: 0,
              right: 1,
              bottom: 0,
              left: 0
            },
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
            plugins: [ctExtendGridClassNames(), ctExtendTickmmarksClassNames(), ctProtrudeGrid(), ctGridOnTop()]
          }
        }
      };

      _export('chartistConfigs', chartistConfigs);
    }
  };
});