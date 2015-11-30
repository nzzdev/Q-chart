define(['exports', 'module', '../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-protrude-grid.js'], function (exports, module, _chartistPluginsChartistPluginClassAxisJs, _chartistPluginsChartistPluginProtrudeGridJs) {
  'use strict';

  module.exports = getConfig;
  var vertBarHeight = 10;
  var vertBarSetPadding = 22;

  var chartistConfigs = {

    bar: {
      small: {
        height: 200,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        reverseData: true,
        horizontalBars: true,
        seriesBarDistance: 11,
        axisX: {
          showGrid: true,
          position: 'start'
        },
        axisY: {
          showGrid: false
        },
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)()]
      },
      large: {
        height: 200,
        fullWidth: true,
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)()]
      }
    },

    line: {
      small: {
        height: 200,

        showPoint: false,
        lineSmooth: false,
        axisX: {
          showGrid: true,
          showLabel: true,
          labelInterpolationFnc: function skipLabels(value, index) {
            return index % 12 === 0 ? value : null;
          }
        },
        axisY: {
          position: 'start',
          scaleMinSpace: 40
        },
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)()]
      },
      large: {
        height: 200,

        showPoint: false,
        lineSmooth: false,
        axisX: {
          showGrid: true,
          showLabel: true,
          labelInterpolationFnc: function skipLabels(value, index) {
            return index % 12 === 0 ? value : null;
          }
        },
        axisY: {
          position: 'start',
          scaleMinSpace: 40
        },
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)()]
      }
    }

  };

  function getConfig(type, size, data) {
    var config = chartistConfigs[type][size];
    if (type === 'bar' && size === 'small') {
      config.height = (vertBarHeight * data.y.data.length + vertBarSetPadding) * data.labels.length;
    }
    return config;
  }
});