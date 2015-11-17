'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _papaparse = require('papaparse');

var _papaparse2 = _interopRequireDefault(_papaparse);

var _array2d = require('array2d');

var _array2d2 = _interopRequireDefault(_array2d);

var _aureliaFramework = require('aurelia-framework');

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
          fields: [dataForView.x.label].concat(dataForView.series.map(function (serie) {
            return serie.label;
          })),
          data: _array2d2['default'].transpose([dataForView.x.data].concat(dataForView.series.map(function (serie) {
            return serie.data;
          })))
        };
        dataForView = _papaparse2['default'].unparse(dataForPapa, {
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
      var parsedData = _papaparse2['default'].parse(data)["data"];
      var transposedData = _array2d2['default'].transpose(parsedData);
      var x = transposedData.shift();
      var series = transposedData;
      var dataForChart = {
        x: {
          label: x.shift(),
          data: x
        },
        series: series.map(function (serie) {
          return {
            label: serie.shift(),
            data: serie
          };
        })
      };
      return dataForChart;
    }
  }]);

  var _ChartDataValueConverter = ChartDataValueConverter;
  ChartDataValueConverter = (0, _aureliaFramework.valueConverter)('chartDataConverter')(ChartDataValueConverter) || ChartDataValueConverter;
  return ChartDataValueConverter;
})();

exports.ChartDataValueConverter = ChartDataValueConverter;