System.register(['chartist'], function (_export) {
    'use strict';

    var Chartist, defaultOptions;

    _export('ctExtendGridClassNames', ctExtendGridClassNames);

    function ctExtendGridClassNames(options) {

        options = Object.assign(defaultOptions, options);

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
    }

    return {
        setters: [function (_chartist) {
            Chartist = _chartist['default'];
        }],
        execute: function () {
            defaultOptions = {
                first: 'first',
                last: 'last'
            };
            ;
        }
    };
});