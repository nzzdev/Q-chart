define(['exports', 'chartist', '../resources/vizColors.js'], function (exports, _chartist, _resourcesVizColorsJs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctSeriesClassOrder = ctSeriesClassOrder;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

  function ctSeriesClassOrder() {

    return function ctSeriesClassOrder(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('created', function (data) {
          var series = data.svg.querySelectorAll('.ct-horizontal-bars .ct-series');
          if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
            var _length = series.svgElements.length;
            var i = _length;
            while (i--) {
              series.svgElements[i].removeClass('ct-series-' + alphabet[i]);
              series.svgElements[i].removeClass(_resourcesVizColorsJs.vizColorClasses[i]);
              series.svgElements[i].addClass('ct-series-' + alphabet[_length - 1 - i]);
              series.svgElements[i].addClass(_resourcesVizColorsJs.vizColorClasses[_length - 1 - i]);
            }
          }
        });
      }
    };
  }

  ;
});