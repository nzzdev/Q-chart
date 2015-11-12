define(['exports', 'aurelia-framework', 'aurelia-binding', 'chartist', 'computed-style-to-inline-style', 'papaparse', './styles.css!'], function (exports, _aureliaFramework, _aureliaBinding, _chartist, _computedStyleToInlineStyle, _papaparse, _stylesCss) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Chartist = _interopRequireDefault(_chartist);

  var _computedToInline = _interopRequireDefault(_computedStyleToInlineStyle);

  var _Papa = _interopRequireDefault(_papaparse);

  var ToolboxChart = (function () {
    function ToolboxChart(ObserverLocator) {
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

      this.observerLocator = ObserverLocator;

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
        if (!_Chartist['default'].hasOwnProperty(this.chartType)) throw 'chartType (' + this.chartType + ') not available';
        this.chart = new _Chartist['default'][this.chartType](this.chartElement, this.chartData, this.chartConfig);
      }
    }, {
      key: 'getChartDataForChartist',
      value: function getChartDataForChartist(data) {
        var parsedData = _Papa['default'].parse(data)["data"];
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
    }]);

    var _ToolboxChart = ToolboxChart;
    ToolboxChart = (0, _aureliaFramework.inject)(_aureliaBinding.ObserverLocator)(ToolboxChart) || ToolboxChart;
    ToolboxChart = (0, _aureliaFramework.useView)('./index.html')(ToolboxChart) || ToolboxChart;
    return ToolboxChart;
  })();

  exports.ToolboxChart = ToolboxChart;
});