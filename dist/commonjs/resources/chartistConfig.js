'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getConfig;

var _chartistPluginsChartistPluginClassAxisJs = require('../chartist-plugins/chartist-plugin-class-axis.js');

var _chartistPluginsChartistPluginProtrudeGridJs = require('../chartist-plugins/chartist-plugin-protrude-grid.js');

var _chartistPluginsChartistPluginGridOnTopJs = require('../chartist-plugins/chartist-plugin-grid-on-top.js');

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
      plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
      plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
      plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
      plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
    }
  }
};

function getConfig(type, size, data) {
  var config = chartistConfigs[type][size];

  if (type === 'bar' && data.series.length * data.labels.length >= 30) {
    console.log('+++ uh, barchart and more than 30 bars, better switch to mobile layout on desktop +++');
  }

  if (type === 'bar' && data.series[0].length >= 12) {
    console.log('+++ uh, barchart and more than 12 datapoints in first series. so many bars, what about a nice linechart instead +++');
  }

  if (type === 'line' && data.series[0].length < 12) {
    console.log('+++ uh, linechart and less than 12 datapoints in first series. might look chunky, what about a nice bar chart instead +++');
  }

  if (type === 'bar' && size === 'small') {
    config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
  }
  return config;
}

module.exports = exports['default'];