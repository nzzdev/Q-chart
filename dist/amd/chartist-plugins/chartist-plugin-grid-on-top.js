define(['exports', 'chartist'], function (exports, _chartist) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.ctGridOnTop = ctGridOnTop;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Chartist = _interopRequireDefault(_chartist);

    function ctGridOnTop() {
        return function ctGridOnTop(chart) {
            if (chart instanceof _Chartist['default'].Line || _Chartist['default'].Bar) {
                chart.on('created', function () {
                    var layerGrid = chart.svg._node.children[0];
                    var lastChild = chart.svg._node.children[1];
                    console.log(lastChild);

                    lastChild.parentNode.insertBefore(layerGrid, lastChild.nextSibling);
                });
            }
        };
    }

    ;
});