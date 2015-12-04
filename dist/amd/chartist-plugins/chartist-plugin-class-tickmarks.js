define(['exports', 'chartist'], function (exports, _chartist) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.ctExtendTickmmarksClassNames = ctExtendTickmmarksClassNames;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Chartist = _interopRequireDefault(_chartist);

    var defaultOptions = {
        first: 'first',
        last: 'last'
    };

    function ctExtendTickmmarksClassNames(options) {

        options = Object.assign(defaultOptions, options);

        return function ctExtendTickmmarksClassNames(chart) {
            if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {
                chart.on('draw', function (data) {
                    if (data.type === 'label') {

                        var labelIndex = data.index;
                        var labelClassList = data.element._node.lastChild.classList;
                        var labelDirection = data.axis.units.dir;

                        if (labelIndex === 0) {
                            labelClassList.add('ct-' + labelDirection + '-' + options.first);
                        }

                        if (labelIndex === data.axis.ticks.length - 1) {
                            labelClassList.add('ct-' + labelDirection + '-' + options.last);
                        }
                    }
                });
            }
        };
    }

    ;
});