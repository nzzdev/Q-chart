System.register(['./env', 'aurelia-framework', 'aurelia-binding', 'chartist', 'computed-style-to-inline-style', 'papaparse', './styles.css!'], function (_export) {
  'use strict';

  var env, useView, inject, ObserverLocator, Chartist, computedToInline, Papa, ToolboxChart;

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
    }, function (_stylesCss) {}],
    execute: function () {
      ToolboxChart = (function () {
        function ToolboxChart(observerLocator, itemConf) {
          _classCallCheck(this, _ToolboxChart);

          this.chartData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            series: [[12, 9, 7, 8, 5], [2, 1, 3.5, 7, 3], [1, 3, 4, 5, 6]]
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
            this.chart = new Chartist[this.chartType](this.chartElement, this.chartData, this.chartConfig);
          }
        }, {
          key: 'getChartDataForChartist',
          value: function getChartDataForChartist(data) {
            var parsedData = Papa.parse(data)["data"];
            var dataForChart = {
              labels: parsedData.shift().slice(0),
              series: parsedData.slice(0)
            };
            return dataForChart;
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
            this.itemConf.conf = Object.assign(this.itemConf.conf, { chartConfig: this.chartConfig }, { data: this.chartData });
            this.itemConf.conf.title = 'MyFirstChart';
            this.itemConf.save().then(function (args) {
              console.log('saved', args);
            });
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