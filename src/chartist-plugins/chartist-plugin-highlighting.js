import Chartist from 'chartist';

export function ctHighlighting(highlightDataSeries, countAsc = true, dataLength) {

  let highLightedIndex = Number(highlightDataSeries);

  return function ctHighlighting(chart) {

      let moveToFront = function (el) {
        el.parentNode.appendChild(el)
      }

      chart.on('created', function(data) {
        try {
          data.svg.addClass('highlighted');
          let active = data.svg._node.querySelector('.active').parentNode;
          moveToFront( active );
        } catch(e) {

        }
      });

      chart.on('draw', function(data) {
        try {

          if (chart instanceof Chartist.Bar || chart instanceof Chartist.Line) {

            let index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (index === highLightedIndex) {
              data.element.addClass('active');
            }else{
              data.element.removeClass('active');
            }

          }

        } catch(e) {

        }
      });
  };
};
