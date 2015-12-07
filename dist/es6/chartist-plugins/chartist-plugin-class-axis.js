// plugin to class gridlines for highlighting baseline
// found it here https://github.com/gionkunz/chartist-js/issues/493
// ATTENTION! does not work on IE because oc lineClassList, check the link

import Chartist from 'chartist';

export function ctExtendGridClassNames(options) {

    return function ctExtendGridClassNames(chart) {
        if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
            chart.on('draw', function(data) {

                if(data.type === 'grid') {
                    var lineIndex = data.index;
                    var lineClassList = data.element._node.classList;

                    // Add classname to baseline
                    if(data.axis.ticks[lineIndex] === 0) {
                        lineClassList.add('ct-baseline');
                    }

                }
            });
        }
    };
};
