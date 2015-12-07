System.register(['chartist'], function (_export) {
    'use strict';

    var Chartist;

    _export('ctExtendGridClassNames', ctExtendGridClassNames);

    function ctExtendGridClassNames(options) {

        return function ctExtendGridClassNames(chart) {
            if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
                chart.on('draw', function (data) {

                    if (data.type === 'grid') {
                        var lineIndex = data.index;
                        var lineClassList = data.element._node.classList;

                        if (data.axis.ticks[lineIndex] === 0) {
                            console.log(data);
                            lineClassList.add('ct-baseline');
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
            ;
        }
    };
});