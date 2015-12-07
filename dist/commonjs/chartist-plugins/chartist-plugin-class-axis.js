'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.ctExtendGridClassNames = ctExtendGridClassNames;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctExtendGridClassNames(options) {

    return function ctExtendGridClassNames(chart) {
        if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {
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

;