import Chartist from 'chartist';

export function ctHighlighting(highlightDataSeries, countAsc = true, dataLength, preventLabelClasses) {
  
  let highLightedIndex = Number(highlightDataSeries);
  let hasHighlighted = highLightedIndex > -1;
  
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
          let index = countAsc ? data.index : dataLength - 1 - data.index;
          if (hasHighlighted && index === highLightedIndex) {
            if(data.type === 'line' || data.type === 'bar' || (data.type === 'label' && !preventLabelClasses )) {
              data.element._node.classList.add('active');
            }
          }else{
            data.element._node.classList.remove('active');
          }
        } catch(e) {

        }
			});
      
  };
};
