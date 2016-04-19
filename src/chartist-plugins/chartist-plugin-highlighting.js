import Chartist from 'chartist';

export function ctHighlighting(highlightDataSeries, countAsc = true, dataLength) {

  let highLightedIndex = Number(highlightDataSeries);
  let hasHighlighted = highLightedIndex != null;

  return function ctHighlighting(chart) {

      let moveToFront = function (el) {
        el.parentNode.appendChild(el)
      }

      chart.on('created', function(data) {
        try {
          if (hasHighlighted) {
            data.svg._node.classList.add('highlighted');
            let active = data.svg._node.querySelector('.active').parentNode;
            moveToFront( active );
          }else{
            data.svg._node.classList.remove('highlighted');
          }
        } catch(e) {

        }
      });


      chart.on('draw', function(data) {
        try {

          if (chart instanceof Chartist.Bar) {
            
            let index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (hasHighlighted && index === highLightedIndex) {
              data.element._node.classList.add('active');
            }else{
              data.element._node.classList.remove('active');
            }

          } else if (chart instanceof Chartist.Line) {

            let index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (hasHighlighted && index === highLightedIndex) {
              data.element._node.classList.add('active');
            }else{
              data.element._node.classList.remove('active');
            }

          }

        } catch(e) {

        }
      });
  };
};
