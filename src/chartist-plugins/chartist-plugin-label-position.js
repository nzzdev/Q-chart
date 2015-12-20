import Chartist from 'chartist';

export function ctLabelPosition() {

  return function ctLabelPosition(chart) {
    if (chart instanceof Chartist.Bar) {
      chart.on('draw', function(data) {   
        if(data.type === 'label') {

          var labelDirection = data.axis.units.dir;

          // if we dont have foreignObjects around labels (data.element._node.getComputedTextLength is available)
          // we move the text elements to the center of their calculated width
          if (!chart.options.horizontalBars && labelDirection === 'horizontal') {
            if (data.element._node.getComputedTextLength) {
              data.element._node.setAttribute('x',
                Math.floor(
                  parseInt(data.element._node.getAttribute('x')) +
                  ((parseInt(data.element._node.getAttribute('width')) - data.element._node.getComputedTextLength())/2)
                )
              );
            }
          }
          
          if (chart.options.horizontalBars && labelDirection === 'vertical') {
            data.element._node.setAttribute('y', 
              Math.floor(
                data.element._node.getAttribute('y')
                - (data.element._node.getAttribute('height')/2)
                + 15/4  // 15 is the height of the label
              )
            );
          }

        }
      });
    }
  };
};
