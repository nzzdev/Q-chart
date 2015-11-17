System.register(['./env', 'aurelia-framework', 'aurelia-binding', 'chartist', 'computed-style-to-inline-style', 'papaparse', './styles.css!', './display'], function (_export) {
  'use strict';

  var env, useView, inject, ObserverLocator, Chartist, computedToInline, Papa, displayChart, ToolboxChart;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_env) {
      env = _env['default'];
    }, function (_aureliaFramework) {
      useView = _aureliaFramework.useView;
      inject = _aureliaFramework.inject;
    }, function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_computedStyleToInlineStyle) {
      computedToInline = _computedStyleToInlineStyle['default'];
    }, function (_papaparse) {
      Papa = _papaparse['default'];
    }, function (_stylesCss) {}, function (_display) {
      displayChart = _display.display;
    }],
    execute: function () {
      ToolboxChart = (function () {
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

          this.env = env;

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
            if (!Chartist.hasOwnProperty(this.chartType)) throw 'chartType (' + this.chartType + ') not available';
            this.chart = displayChart(this.getDataForStorage(), this.chartElement);
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
        ToolboxChart = inject(ObserverLocator, 'ItemConf')(ToolboxChart) || ToolboxChart;
        ToolboxChart = useView('./index.html')(ToolboxChart) || ToolboxChart;
        return ToolboxChart;
      })();

      _export('ToolboxChart', ToolboxChart);
    }
  };
});