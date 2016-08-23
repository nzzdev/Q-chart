define(['exports', 'chartist', '../resources/vizColors.js'], function (exports, _chartist, _resourcesVizColorsJs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctSophieVizColorClasses = ctSophieVizColorClasses;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function ctSophieVizColorClasses() {

    return function ctSophieVizColorClasses(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('created', function (data) {
          var series = data.svg.querySelectorAll('.ct-series');
          if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
            var _length = series.svgElements.length;
            var i = _length;
            while (i--) {
              series.svgElements[i].addClass(_resourcesVizColorsJs.vizColorClasses[i]);
            }
          }
        });
      }
    };
  }

  ;
});