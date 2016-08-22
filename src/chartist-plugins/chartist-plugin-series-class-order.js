import Chartist from 'chartist';

var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

import {vizColorClasses} from '../resources/vizColors.js';

export function ctSeriesClassOrder() {

  return function ctSeriesClassOrder(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      
      chart.on('created', function(data) {
        let series = data.svg.querySelectorAll('.ct-horizontal-bars .ct-series');
        if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
          let length = series.svgElements.length;
          let i = length;
          while(i--) {
            series.svgElements[i].removeClass(`ct-series-${alphabet[i]}`);
            series.svgElements[i].removeClass(vizColorClasses[i]);
            series.svgElements[i].addClass(`ct-series-${alphabet[length - 1 - i]}`);
            series.svgElements[i].addClass(vizColorClasses[length - 1 - i]);
          }
        }
      });

    }
  };
};
