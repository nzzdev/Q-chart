define(['exports', './chartistConfig', '../chartist-plugins/chartist-plugin-highlighting', './min'], function (exports, _chartistConfig, _chartistPluginsChartistPluginHighlighting, _min) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _min2 = _interopRequireDefault(_min);

  var types = {
    Bar: {
      label: 'Bar',
      chartistType: 'Bar',
      modifyData: function modifyData(config, data, size, rect) {
        if (config.horizontalBars) {
          data.labels.reverse();
          data.series.reverse();
          data.series.map(function (serie) {
            serie.reverse();
          });
        }
      },
      options: [{
        name: 'isColumnChart',
        type: 'oneOf',
        labels: ['Säulen', 'Balken'],
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.height = _chartistConfig.chartHeight;

            config.axisX.showGrid = false;
            config.axisX.position = 'end';
          }
        }
      }, {
        name: 'forceBarsOnSmall',
        type: 'boolean',
        label: 'Balken für Mobile',
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          }
        }
      }, {
        name: 'highlightDataRow',
        type: 'selection',
        label: 'Hervorhebung',
        defaultValue: -1,
        options: [{ label: 'keine', value: -1 }],
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.plugins.push((0, _chartistPluginsChartistPluginHighlighting.ctHighlighting)(value, !config.horizontalBars, data.labels.length));
        }
      }]
    },
    StackedBar: {
      label: 'Stacked Bar',
      chartistType: 'Bar',
      modifyData: function modifyData(config, data, size, rect) {
        if (config.horizontalBars) {
          data.labels.reverse();
          data.series.reverse();
          data.series.map(function (serie) {
            serie.reverse();
          });
        }
      },
      options: [{
        name: 'isColumnChart',
        type: 'oneOf',
        labels: ['Säulen', 'Balken'],
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.height = _chartistConfig.chartHeight;

            config.axisX.showGrid = false;
            config.axisX.position = 'end';
          }
        }
      }, {
        name: 'forceBarsOnSmall',
        type: 'boolean',
        label: 'Balken für Mobile',
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          }
        }
      }, {
        name: 'highlightDataRow',
        type: 'selection',
        label: 'Hervorhebung',
        defaultValue: -1,
        options: [{ label: 'keine', value: -1 }],
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.plugins.push((0, _chartistPluginsChartistPluginHighlighting.ctHighlighting)(value, !config.horizontalBars, data.labels.length));
        }
      }]
    },
    Line: {
      label: 'Line',
      chartistType: 'Line',
      options: [{
        name: 'minValue',
        type: 'number',
        label: 'Minimaler Wert',
        defaultValue: undefined,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          if (value && value !== '' && !isNaN(Number(value))) {
            config.low = Number(value);
          }
        }
      }, {
        name: 'maxValue',
        type: 'number',
        label: 'Maximaler Wert',
        defaultValue: undefined,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          if (value && value !== '' && !isNaN(Number(value))) {
            config.high = Number(value);
          }
        }
      }, {
        name: 'highlightDataRow',
        type: 'selection',
        label: 'Hervorhebung',
        defaultValue: -1,
        options: [{ label: 'keine', value: -1 }],
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.plugins.push((0, _chartistPluginsChartistPluginHighlighting.ctHighlighting)(value, true, data.series.length, true));
        }
      }],
      modifyConfig: function modifyConfig(config, data, size, rect) {
        if (typeof config.low !== 'undefined') {
          return;
        }

        config.low = 0;

        var minValue = (0, _min2['default'])(data.series.map(function (serie) {
          return (0, _min2['default'])(serie.map(function (datapoint) {
            return parseFloat(datapoint);
          }));
        }));
        if (minValue < 0) {
          config.low = minValue;
          return;
        }

        var allFirstHundered = data.series.map(function (serie) {
          return serie[0];
        }).reduce(function (prev, current) {
          return parseInt(current) === 100;
        }, false);
        if (allFirstHundered && minValue >= 100) {
          config.low = 100;
        }

        return;
      }
    }
  };
  exports.types = types;
});