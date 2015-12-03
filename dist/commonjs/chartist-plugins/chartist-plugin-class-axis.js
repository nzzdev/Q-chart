'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.ctExtendGridClassNames = ctExtendGridClassNames;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var defaultOptions = {
    first: 'first',
    last: 'last'
};

function ctExtendGridClassNames(options) {

    options = Object.assign(defaultOptions, options);

    return function ctExtendGridClassNames(chart) {
        if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {
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

;