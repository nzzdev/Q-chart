define(['exports', '../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-protrude-grid.js', '../chartist-plugins/chartist-plugin-grid-on-top.js', '../chartist-plugins/chartist-plugin-class-tickmarks.js', '../chartist-plugins/chartist-plugin-fit-bars.js', './clone'], function (exports, _chartistPluginsChartistPluginClassAxisJs, _chartistPluginsChartistPluginProtrudeGridJs, _chartistPluginsChartistPluginGridOnTopJs, _chartistPluginsChartistPluginClassTickmarksJs, _chartistPluginsChartistPluginFitBarsJs, _clone) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.getConfig = getConfig;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
        axisX: {
          showGrid: true,
          position: 'start'
        },
        axisY: {
          showGrid: false
        },
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)(), (0, _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData)()]
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)(), (0, _chartistPluginsChartistPluginFitBarsJs.ctExtendFitBarsToData)()]
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
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
        plugins: [(0, _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames)(), (0, _chartistPluginsChartistPluginClassTickmarksJs.ctExtendTickmmarksClassNames)(), (0, _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid)(), (0, _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop)()]
      }
    }
  };

  exports.chartistConfigs = chartistConfigs;

  function getConfig(type, size, data) {
    var config = (0, _clone2['default'])(chartistConfigs[type][size]);

    return config;
  }
});