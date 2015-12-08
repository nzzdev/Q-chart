import Chartist from 'chartist';

export function ctExtendFitBarsToData() {

    return function ctExtendFitBarsToData(chart) {

        // set seriesBarDistance
        chart.update(null, {seriesBarDistance: 46}, true);

        console.log(chart.options);

        if(chart instanceof Chartist.Bar) { 
            chart.on('draw', function(data) {
                if(data.type === 'bar') {
                    // set width of bars
                    data.element.attr({style: 'stroke-width: 20px'});
                }
            }); 
        }
    };
};
