import Chartist from 'chartist';

function hasHighlighted(series) {
  let hasHighlighted = false;
  if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
    series.svgElements.forEach(groupElement => {
      if (groupElement.classes().indexOf('ct-highlighted-group') > -1) {
        hasHighlighted = true;
      }
    })
  }
  return hasHighlighted;
}

export function ctColorOverwrite(colorOverwrites, isReversed) {

  return function ctColorOverwrite(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      
      chart.on('created', function(data) {
        let series = data.svg.querySelectorAll('.ct-series');

        let hasHighlightedGroup = hasHighlighted(series);

        if (series && series.svgElements && series.svgElements.length && series.svgElements.length > 0) {
          colorOverwrites.forEach(colorOverwrite => {
            let groupElement;
            if (isReversed) {
              groupElement = series.svgElements.reverse()[colorOverwrite.position - 1]; // -1 because the position option is 1 based not 0 based
            } else {
              groupElement = series.svgElements[colorOverwrite.position - 1]; // -1 because the position option is 1 based not 0 based
            }
            if (!groupElement) {
              return;
            }
            if (hasHighlightedGroup && groupElement.classes().indexOf('ct-highlighted-group') === -1) {
              groupElement.getNode().style.color = colorOverwrite.colorBright;
            } else {
              groupElement.getNode().style.color = colorOverwrite.color;
            }
          })
        }
      });

    }
  };
};