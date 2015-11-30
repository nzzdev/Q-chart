'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getConfig;

var _chartistPluginsChartistPluginClassAxisJs = require('../chartist-plugins/chartist-plugin-class-axis.js');

var _chartistPluginsChartistPluginProtrudeGridJs = require('../chartist-plugins/chartist-plugin-protrude-grid.js');

var vertBarHeight = 10;
var vertBarSetPadding = 22;

var chartistConfigs = {

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
      plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)()]
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
        showLabel: true
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
        showLabel: true
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

  if (data.series.length * data.labels.length >= 30) {
    console.log("+++ uh, more than 30 bars, better switch to mobile layout on desktop +++");
  }

  if (type === 'bar' && size === 'small') {
    config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
  }
  return config;
}

module.exports = exports['default'];