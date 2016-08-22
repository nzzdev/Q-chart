import Chartist from 'chartist';

export function ctBaseline() {
  return function ctBaseline(chart) {
    if (chart instanceof Chartist.Line || Chartist.Bar) {

      chart.on('draw', function(data) {
        try {
          if (data.type === 'grid') {
            var lineIndex = data.index;
            // Add classname to baseline
            if (data.axis.ticks[lineIndex] === 0) {
              data.element.addClass('ct-baseline');
            }
          }
        } catch(e) {

        }
      });

      chart.on('created', function() {
        try {
          var baselineGroup = chart.svg.elem('g').addClass('ct-baseline-group');
          var baselineLine = chart.svg.querySelector('.ct-baseline s-color-gray-8');
          baselineGroup.append(baselineLine);
          chart.svg.append(baselineGroup);
        } catch(e) {
          
        }
      });

    }
  };
};
