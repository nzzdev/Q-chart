import Chartist from 'chartist';

import { vizColorClasses, brightVizColorClasses } from '../resources/vizColors.js';

export function ctHighlighting(highlightedIndex, isReversed, dataLength) {

  return function ctHighlighting(chart) {

      chart.on('created', function(data) {
        try {
          // change the color classes attributes on all groups
          // based on highlightedIndex
          let series = data.svg.querySelectorAll('.ct-series');
          if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
            let seriesElements;
            if (isReversed) {
              seriesElements = series.svgElements.slice(0).reverse();
            } else {
              seriesElements = series.svgElements;
            }
            if (!seriesElements) {
              return;
            }
            seriesElements.forEach((groupElement, index) => {
              if (index === highlightedIndex) {
                groupElement.addClass('ct-highlighted');
                groupElement.addClass(vizColorClasses[index]);
                groupElement.removeClass(brightVizColorClasses[index]);
              } else {
                groupElement.removeClass('ct-highlighted');
                groupElement.removeClass(vizColorClasses[index]);
                groupElement.addClass(brightVizColorClasses[index]);
              }
            })
          }
        } catch(e) {
          // console.log(e)
        }
      });
  };
};
