'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctSophieVizColorClasses = ctSophieVizColorClasses;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var _resourcesVizColorsJs = require('../resources/vizColors.js');

function ctSophieVizColorClasses() {

  return function ctSophieVizColorClasses(chart) {
    if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {

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