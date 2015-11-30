define(['exports'], function (exports) {
    'use strict';

    (function (window, document, Chartist) {
        'use strict';

        var defaultOptions = {
            first: 'first',
            last: 'last'
        };

        Chartist.plugins = Chartist.plugins || {};
        Chartist.plugins.ctExtendGridClassNames = function (options) {

            options = Chartist.extend({}, defaultOptions, options);

            return function ctExtendGridClassNames(chart) {
                if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
                    chart.on('draw', function (data) {
                        if (data.type === 'grid') {
                            var lineIndex = data.index;
                            var lineClassList = data.element._node.classList;
                            var lineDirection = data.axis.units.dir;

                            if (lineIndex === 0) {
                                lineClassList.add('ct-' + lineDirection + '-' + options.first);
                            }

                            if (lineIndex === data.axis.ticks.length - 1) {
                                lineClassList.add('ct-' + lineDirection + '-' + options.last);
                            }
                        }
                    });
                }
            };
        };
    })(window, document, Chartist);
});