System.register(['../chartist-plugins/chartist-plugin-protrude-grid.js', '../chartist-plugins/chartist-plugin-baseline.js', '../chartist-plugins/chartist-plugin-label-classes.js', '../chartist-plugins/chartist-plugin-label-position.js', '../chartist-plugins/chartist-plugin-fit-bars.js', './clone'], function (_export) {
  'use strict';

  var ctProtrudeGrid, ctBaseline, ctLabelClasses, ctLabelPosition, ctExtendFitBarsToData, clone, vertBarHeight, vertBarSetPadding, chartHeight, chartistConfigs;

  _export('getConfig', getConfig);

  function getConfig(item, size) {
    var config = clone(chartistConfigs[item.type][size]);

    return config;
  }

  return {
    setters: [function (_chartistPluginsChartistPluginProtrudeGridJs) {
      ctProtrudeGrid = _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid;
    }, function (_chartistPluginsChartistPluginBaselineJs) {
      ctBaseline = _chartistPluginsChartistPluginBaselineJs.ctBaseline;
    }, function (_chartistPluginsChartistPluginLabelClassesJs) {
      ctLabelClasses = _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses;
    }, function (_chartistPluginsChartistPluginLabelPositionJs) {
      ctLabelPosition = _chartistPluginsChartistPluginLabelPositionJs.ctLabelPosition;
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
            axisX: {},
            axisY: {},
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline()]
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
            axisX: {},
            axisY: {},
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline(), ctExtendFitBarsToData()]
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
            axisX: {},
            axisY: {},
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline()]
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
            axisX: {},
            axisY: {},
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline(), ctExtendFitBarsToData()]
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
            fullWidth: true,
            axisX: {
              showGrid: true,
              showLabel: true
            },
            axisY: {
              showGrid: true,
              position: 'start',
              scaleMinSpace: 40
            },
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline()]
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
            fullWidth: true,
            axisX: {
              showGrid: true,
              showLabel: true
            },
            axisY: {
              showGrid: true,
              position: 'start',
              scaleMinSpace: 40
            },
            plugins: [ctLabelClasses(), ctLabelPosition(), ctProtrudeGrid(), ctBaseline()]
          }
        }
      };

      _export('chartistConfigs', chartistConfigs);
    }
  };
});