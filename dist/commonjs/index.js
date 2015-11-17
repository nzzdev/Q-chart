'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _aureliaFramework = require('aurelia-framework');

var _aureliaBinding = require('aurelia-binding');

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _computedStyleToInlineStyle = require('computed-style-to-inline-style');

var _computedStyleToInlineStyle2 = _interopRequireDefault(_computedStyleToInlineStyle);

var _papaparse = require('papaparse');

var _papaparse2 = _interopRequireDefault(_papaparse);

require('./styles.css!');

var _display = require('./display');

var ToolboxChart = (function () {
  function ToolboxChart(observerLocator, itemConf) {
    _classCallCheck(this, _ToolboxChart);

    this.chartData = {
      x: {
        label: 'date',
        data: ['2000-01-01', '2000-02-01', '2000-03-01', '2000-04-01', '2000-05-01', '2000-06-01', '2000-07-01', '2000-08-01', '2000-09-01', '2000-10-01', '2000-11-01', '2000-12-01']
      },
      series: [{
        label: 'Juice',
        data: [106.3, 106.0, 105.4, 101.8, 95.9, 94.1, 102.0, 98.5, 105.1, 99.0, 97.7, 88.2]
      }, {
        label: 'Travel',
        data: [49.843099, 49.931931, 61.478163, 58.981617, 61.223861, 65.601574, 67.89832, 67.028338, 56.441629, 58.83421, 56.283261, 55.38028]
      }]
    };
    this.chartConfig = {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    };
    this.chartTypes = ['Line', 'Bar'];

    this.env = _env2['default'];

    this.observerLocator = observerLocator;
    this.itemConf = itemConf;

    this.itemConf.conf.tool = 'chart';
    this.itemConf.conf.tool_version = this.env.TOOL_VERSION;

    this.observerLocator.getObserver(this, 'chartType').subscribe(this.drawChart.bind(this));

    this.observerLocator.getObserver(this, 'chartData').subscribe(this.drawChart.bind(this));
  }

  _createClass(ToolboxChart, [{
    key: 'attached',
    value: function attached() {
      this.chartType = 'Line';
    }
  }, {
    key: 'drawChart',
    value: function drawChart() {
      if (!_chartist2['default'].hasOwnProperty(this.chartType)) throw 'chartType (' + this.chartType + ') not available';
      this.chart = (0, _display.display)(this.getDataForStorage(), this.chartElement);
    }
  }, {
    key: 'utf8_to_b64',
    value: function utf8_to_b64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
  }, {
    key: 'b64_to_utf8',
    value: function b64_to_utf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
    }
  }, {
    key: 'save',
    value: function save() {
      this.itemConf.conf = this.getDataForStorage();
      this.itemConf.save().then(function (args) {
        console.log('saved', args);
      });
    }
  }, {
    key: 'getDataForStorage',
    value: function getDataForStorage() {
      var conf = Object.assign(this.itemConf.conf, { chartConfig: this.chartConfig }, { data: this.chartData }, { chartType: this.chartType });
      conf.title = 'MyFirstChart';
      return conf;
    }
  }]);

  var _ToolboxChart = ToolboxChart;
  ToolboxChart = (0, _aureliaFramework.inject)(_aureliaBinding.ObserverLocator, 'ItemConf')(ToolboxChart) || ToolboxChart;
  ToolboxChart = (0, _aureliaFramework.useView)('./index.html')(ToolboxChart) || ToolboxChart;
  return ToolboxChart;
})();

exports.ToolboxChart = ToolboxChart;