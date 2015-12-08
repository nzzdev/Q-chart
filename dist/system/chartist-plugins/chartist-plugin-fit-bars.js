System.register(['chartist'], function (_export) {
    'use strict';

    var Chartist;

    _export('ctExtendFitBarsToData', ctExtendFitBarsToData);

    function ctExtendFitBarsToData() {

        return function ctExtendFitBarsToData(chart) {
            chart.update(null, { seriesBarDistance: 46 }, true);

            console.log(chart.options);

            if (chart instanceof Chartist.Bar) {
                chart.on('draw', function (data) {
                    if (data.type === 'bar') {}
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