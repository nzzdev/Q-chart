import Chartist from 'chartist';

import {vizColorClasses} from '../resources/vizColors.js';


export function ctSophieVizColorClasses() {

  return function ctSophieVizColorClasses(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      
      chart.on('created', function(data) {
        let series = data.svg.querySelectorAll('.ct-series');
        if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
          let length = series.svgElements.length;
          let i = length;
          while(i--) {
            series.svgElements[i].addClass(vizColorClasses[i]);
          }
        }
      });

    }
  };
};
