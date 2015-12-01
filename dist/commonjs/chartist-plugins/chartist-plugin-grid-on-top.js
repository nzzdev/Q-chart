'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.ctGridOnTop = ctGridOnTop;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctGridOnTop() {
    return function ctGridOnTop(chart) {
        if (chart instanceof _chartist2['default'].Line || _chartist2['default'].Bar) {
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