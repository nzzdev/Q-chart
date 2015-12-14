define(['exports', './chartistConfig', 'd3-array/src/min'], function (exports, _chartistConfig, _d3ArraySrcMin) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _min = _interopRequireDefault(_d3ArraySrcMin);

  var types = {
    Bar: {
      label: 'Bar',
      chartistType: 'Bar',
      options: [{
        name: 'isColumnChart',
        type: 'oneOf',
        labels: ['Säulen', 'Balken'],
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.reverseData = true;
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.reverseData = false;
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
            config.reverseData = true;
            config.height = (_chartistConfig.vertBarHeight * data.series.length + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.reverseData = false;
          }
        }
      }]
    },
    StackedBar: {
      label: 'Stacked Bar',
      chartistType: 'Bar',
      options: [{
        name: 'isColumnChart',
        type: 'oneOf',
        labels: ['Säulen', 'Balken'],
        defaultValue: true,
        modifyConfig: function modifyConfig(config, value, data, size, rect) {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.reverseData = true;
            config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.reverseData = false;
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
            config.reverseData = true;
            config.height = (_chartistConfig.vertBarHeight + _chartistConfig.vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.reverseData = false;
          }
        }
      }]
    },
    Line: {
      label: 'Line',
      chartistType: 'Line',
      options: [],
      modifyConfig: function modifyConfig(config, data, size, rect) {
        config.low = 0;

        var minValue = (0, _min['default'])(data.series.map(function (serie) {
          return (0, _min['default'])(serie);
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