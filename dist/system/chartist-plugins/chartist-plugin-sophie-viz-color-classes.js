System.register(['chartist', '../resources/vizColors.js'], function (_export) {
  'use strict';

  var Chartist, vizColorClasses;

  _export('ctSophieVizColorClasses', ctSophieVizColorClasses);

  function ctSophieVizColorClasses() {

    return function ctSophieVizColorClasses(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

        chart.on('created', function (data) {
          var series = data.svg.querySelectorAll('.ct-series');
          if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
            var _length = series.svgElements.length;
            var i = _length;
            while (i--) {
              series.svgElements[i].addClass(vizColorClasses[i]);
            }
          }
        });
      }
    };
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_resourcesVizColorsJs) {
      vizColorClasses = _resourcesVizColorsJs.vizColorClasses;
    }],
    execute: function () {
      ;
    }
  };
});