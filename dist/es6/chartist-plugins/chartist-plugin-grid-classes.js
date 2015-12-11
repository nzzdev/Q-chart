import Chartist from 'chartist';

export function ctGridClasses() {

  return function ctGridClasses(chart) {
    if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
      chart.on('draw', function(data) {

        if (data.type === 'grid') {
          var lineIndex = data.index;

          // Add classname to baseline
          if (data.axis.ticks[lineIndex] === 0) {
            data.element.addClass('ct-baseline');
          }
        }

      });
    }
  };
};
