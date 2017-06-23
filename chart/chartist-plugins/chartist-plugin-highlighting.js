import Chartist from 'chartist';

import { vizColorClasses, brightVizColorClasses } from '../resources/vizColors.js';

export function ctHighlighting(highlightedIndex, isReversed, dataLength) {

  return function ctHighlighting(chart) {

      let moveToFront = function (el) {
        el.parentNode.appendChild(el)
      }

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
            seriesElements.forEach((seriesElement, index) => {
              if (index === highlightedIndex) {
                seriesElement.addClass('ct-highlighted');
                seriesElement.addClass(vizColorClasses[index]);
                seriesElement.removeClass(brightVizColorClasses[index]);
                moveToFront(seriesElement.getNode());
              } else {
                seriesElement.removeClass('ct-highlighted');
                seriesElement.removeClass(vizColorClasses[index]);
                seriesElement.addClass(brightVizColorClasses[index]);
              }
            })
          }
        } catch(e) {
          // console.log(e)
        }
      });
  };
};
