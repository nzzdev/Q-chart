define(['exports', 'chartist'], function (exports, _chartist) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.ctExtendGridClassNames = ctExtendGridClassNames;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Chartist = _interopRequireDefault(_chartist);

    function ctExtendGridClassNames(options) {

        return function ctExtendGridClassNames(chart) {
            if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {
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
});