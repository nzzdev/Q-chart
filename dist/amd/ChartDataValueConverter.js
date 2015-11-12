define(['exports', 'papaparse', 'aurelia-framework'], function (exports, _papaparse, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Papa = _interopRequireDefault(_papaparse);

  var ChartDataValueConverter = (function () {
    function ChartDataValueConverter() {
      _classCallCheck(this, _ChartDataValueConverter);
    }

    _createClass(ChartDataValueConverter, [{
      key: 'toView',
      value: function toView(data) {
        var dataForView = data;
        if (typeof dataForView === 'object') {
          var dataForPapa = {
            fields: dataForView.labels,
            data: dataForView.series
          };
          dataForView = _Papa['default'].unparse(dataForPapa, {
            quotes: false,
            delimiter: "\t",
            newline: "\n"
          });
        }
        return dataForView;
      }
    }, {
      key: 'fromView',
      value: function fromView(data) {
        var parsedData = _Papa['default'].parse(data)["data"];
        var dataForChart = {
          labels: parsedData.shift().slice(0),
          series: parsedData.slice(0)
        };
        return dataForChart;
      }
    }]);

    var _ChartDataValueConverter = ChartDataValueConverter;
    ChartDataValueConverter = (0, _aureliaFramework.valueConverter)('chartDataConverter')(ChartDataValueConverter) || ChartDataValueConverter;
    return ChartDataValueConverter;
  })();

  exports.ChartDataValueConverter = ChartDataValueConverter;
});