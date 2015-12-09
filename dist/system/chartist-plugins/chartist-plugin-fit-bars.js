System.register(['chartist'], function (_export) {
    'use strict';

    var Chartist;

    _export('ctExtendFitBarsToData', ctExtendFitBarsToData);

    function ctExtendFitBarsToData() {

        return function ctExtendFitBarsToData(chart) {

            if (chart instanceof Chartist.Bar) {
                chart.on('draw', function (data) {
                    if (data.type === 'bar') {
                        data.element.attr({ style: 'stroke-width:' + chart.options.barWidth + 'px' });
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