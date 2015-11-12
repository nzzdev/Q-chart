System.register(['papaparse', 'aurelia-framework'], function (_export) {
  'use strict';

  var Papa, valueConverter, ChartDataValueConverter;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_papaparse) {
      Papa = _papaparse['default'];
    }, function (_aureliaFramework) {
      valueConverter = _aureliaFramework.valueConverter;
    }],
    execute: function () {
      ChartDataValueConverter = (function () {
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
              dataForView = Papa.unparse(dataForPapa, {
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
            var parsedData = Papa.parse(data)["data"];
            var dataForChart = {
              labels: parsedData.shift().slice(0),
              series: parsedData.slice(0)
            };
            return dataForChart;
          }
        }]);

        var _ChartDataValueConverter = ChartDataValueConverter;
        ChartDataValueConverter = valueConverter('chartDataConverter')(ChartDataValueConverter) || ChartDataValueConverter;
        return ChartDataValueConverter;
      })();

      _export('ChartDataValueConverter', ChartDataValueConverter);
    }
  };
});