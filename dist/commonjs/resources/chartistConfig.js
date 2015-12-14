'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getConfig = getConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartistPluginsChartistPluginProtrudeGridJs = require('../chartist-plugins/chartist-plugin-protrude-grid.js');

var _chartistPluginsChartistPluginBaselineJs = require('../chartist-plugins/chartist-plugin-baseline.js');

var _chartistPluginsChartistPluginLabelClassesJs = require('../chartist-plugins/chartist-plugin-label-classes.js');

var _chartistPluginsChartistPluginFitBarsJs = require('../chartist-plugins/chartist-plugin-fit-bars.js');

var _clone = require('./clone');

var _clone2 = _interopRequireDefault(_clone);

var vertBarHeight = 10;
exports.vertBarHeight = vertBarHeight;
var vertBarSetPadding = 22;
exports.vertBarSetPadding = vertBarSetPadding;
var chartHeight = 200;

exports.chartHeight = chartHeight;
var chartistConfigs = {

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
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)()]
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
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)(), (0, _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData)()]
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
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)()]
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
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)(), (0, _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData)()]
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
        showGrid: true,
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)()]
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
        showGrid: true,
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [(0, _chartistPluginsChartistPluginLabelClassesJs.ctLabelClasses)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginBaselineJs.ctBaseline)()]
    }
  }
};

exports.chartistConfigs = chartistConfigs;

function getConfig(type, size, data) {
  var config = (0, _clone2['default'])(chartistConfigs[type][size]);

  return config;
}