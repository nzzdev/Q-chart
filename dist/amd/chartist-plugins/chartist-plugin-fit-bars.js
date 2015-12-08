define(['exports', 'chartist'], function (exports, _chartist) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.ctExtendFitBarsToData = ctExtendFitBarsToData;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Chartist = _interopRequireDefault(_chartist);

    function ctExtendFitBarsToData() {

        return function ctExtendFitBarsToData(chart) {
            chart.update(null, { seriesBarDistance: 46 }, true);

            console.log(chart.options);

            if (chart instanceof _Chartist['default'].Bar) {
                chart.on('draw', function (data) {
                    if (data.type === 'bar') {
                        data.element.attr({ style: 'stroke-width: 20px' });
                    }
                });
            }
        };
    }

    ;
});