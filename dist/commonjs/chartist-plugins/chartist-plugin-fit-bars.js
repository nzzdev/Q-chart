'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.ctExtendFitBarsToData = ctExtendFitBarsToData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctExtendFitBarsToData() {

    return function ctExtendFitBarsToData(chart) {

        if (chart instanceof _chartist2['default'].Bar) {
            chart.on('draw', function (data) {
                if (data.type === 'bar') {
                    console.log(chart.options);
                    data.element.attr({ style: 'stroke-width:' + chart.options.barWidth + 'px' });
                }
            });
        }
    };
}

;