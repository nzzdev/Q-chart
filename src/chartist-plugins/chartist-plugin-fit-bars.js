// chartist plugin for setting bar width which corresponds to current SeriesBarDistance which corresponds to current number of bars
// this plugin needs ../resources/modifyChartistConfigBeforeRender.js to work properly

import Chartist from 'chartist';

export function ctExtendFitBarsToData() {

	return function ctExtendFitBarsToData(chart) {

		//set seriesBarDistance
		//chart.update(null, {seriesBarDistance: 46}, true); // does absolutley not work at all

		if(chart instanceof Chartist.Bar) { 
			chart.on('draw', function(data) {

        try {
  				if(data.type === 'bar') {
  					// set width of bars
            if (chart.options.barWidth) {
  					 data.element.attr({style: 'stroke-width:' + chart.options.barWidth + 'px'});
            }
  				}
        } catch(e) {
          
        }
			});
		}
	};
};
