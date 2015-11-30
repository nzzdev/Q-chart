define(['exports', 'chartist'], function (exports, _chartist) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.ctExtendGridClassNames = ctExtendGridClassNames;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Chartist = _interopRequireDefault(_chartist);

    var defaultOptions = {
        first: 'first',
        last: 'last'
    };

    function ctExtendGridClassNames(options) {

        options = Object.assign(defaultOptions, options);

        return function ctExtendGridClassNames(chart) {
            if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {
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
});