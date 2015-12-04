System.register(['../chartist-plugins/chartist-plugin-class-axis.js', '../chartist-plugins/chartist-plugin-protrude-grid.js', '../chartist-plugins/chartist-plugin-grid-on-top.js'], function (_export) {
  'use strict';

  var ctExtendGridClassNames, ctProtrudeGrid, ctGridOnTop, vertBarHeight, vertBarSetPadding, chartistConfigs;

  _export('default', getConfig);

  function getConfig(type, size, data) {
    var config = chartistConfigs[type][size];

    if (type === 'Bar' && data.series.length * data.labels.length >= 30) {
      console.log('+++ uh, barchart and more than 30 bars, better switch to mobile layout on desktop +++');
    }

    if (type === 'Bar' && data.series[0].length >= 12) {
      console.log('+++ uh, barchart and more than 12 datapoints in first series. so many bars, what about a nice linechart instead +++');
    }

    if (type === 'Line' && data.series[0].length < 12) {
      console.log('+++ uh, linechart and less than 12 datapoints in first series. might look chunky, what about a nice bar chart instead +++');
    }

    if (type === 'Bar' && size === 'small') {
      console.log('+++');
      config.height = (vertBarHeight * data.series.length + vertBarSetPadding) * data.labels.length;
    }

    return config;
  }

  return {
    setters: [function (_chartistPluginsChartistPluginClassAxisJs) {
      ctExtendGridClassNames = _chartistPluginsChartistPluginClassAxisJs.ctExtendGridClassNames;
    }, function (_chartistPluginsChartistPluginProtrudeGridJs) {
      ctProtrudeGrid = _chartistPluginsChartistPluginProtrudeGridJs.ctProtrudeGrid;
    }, function (_chartistPluginsChartistPluginGridOnTopJs) {
      ctGridOnTop = _chartistPluginsChartistPluginGridOnTopJs.ctGridOnTop;
    }],
    execute: function () {
      vertBarHeight = 10;
      vertBarSetPadding = 22;
      chartistConfigs = {

        Bar: {
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
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
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
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
          }
        },

        StackedBar: {
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
            stackBars: true,
            axisX: {
              showGrid: true,
              position: 'start'
            },
            axisY: {
              showGrid: false
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
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
            stackBars: true,
            axisX: {
              showGrid: false,
              position: 'end'
            },
            axisY: {
              showGrid: true
            },
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
          }
        },

        Line: {
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
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
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
            plugins: [ctExtendGridClassNames(), ctProtrudeGrid(), ctGridOnTop()]
          }
        }
      };
    }
  };
});