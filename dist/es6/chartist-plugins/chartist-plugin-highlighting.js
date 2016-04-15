import Chartist from 'chartist';

export function ctHighlighting(highlightDataRow, countAsc = true, dataLength, preventLabelClasses) {

  let highLightedIndex = Number(highlightDataRow);
  let hasHighlightedBar = highLightedIndex > -1;

  return function ctHighlighting(chart) {

      console.log('bla');
      chart.on('created', function(data) {
        try {
          let {element,options} = data;
          if (hasHighlightedBar) {
            data.svg._node.classList.add('highlighted');
          }else{
            data.svg._node.classList.remove('highlighted');
          }
        } catch(e) {

        }
      });

      chart.on('draw', function(data) {
        let index = countAsc ? data.index : dataLength - 1 - data.index;
        try {
          if (hasHighlightedBar && index === highLightedIndex) {
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
