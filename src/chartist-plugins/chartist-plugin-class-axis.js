// plugin to class gridlines for highlighting baseline
// found it here https://github.com/gionkunz/chartist-js/issues/493
// ATTENTION! does not work on IE because oc lineClassList, chech the link

import Chartist from 'chartist';

var defaultOptions = {
    first: 'first',
    last: 'last'
};

// Chartist.plugins = Chartist.plugins || {};

export function ctExtendGridClassNames(options) {

    options = Object.assign(defaultOptions, options);

    return function ctExtendGridClassNames(chart) {
        if(chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
            chart.on('draw', function(data) {
                if(data.type === 'grid') {
                    var lineIndex = data.index;
                    var lineClassList = data.element._node.classList;
                    var lineDirection = data.axis.units.dir;

                    // Add classname to first line in an axis
                    if(lineIndex === 0) {
                        lineClassList.add('ct-' + lineDirection + '-' + options.first);
                    }

                    // Add classname to last line in an axis
                    if(lineIndex === data.axis.ticks.length - 1) {
                        lineClassList.add('ct-' + lineDirection + '-' + options.last);
                    }
                }
            });
        }
    };
};
