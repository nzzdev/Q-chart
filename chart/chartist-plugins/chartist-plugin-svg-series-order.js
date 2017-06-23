import Chartist from 'chartist';

import { vizColorClasses, brightVizColorClasses } from '../resources/vizColors.js';

export function ctSvgSeriesOrder() {

  return function ctSvgSeriesOrder(chart) {

      let moveToFront = function (el) {
        el.parentNode.appendChild(el)
      }

      chart.on('created', function(data) {
        try {
          // move any highlighted serie to the front
          let series = data.svg.querySelectorAll('.ct-series');
          if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
            
            series.svgElements.forEach((groupElement, index) => {
              if (groupElement.getNode().classList.contains('ct-highlighted')) {
                moveToFront(groupElement.getNode());
              }
            })
          }
        } catch(e) {
        }
      });
  };
};
