'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctLabelPosition = ctLabelPosition;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctLabelPosition() {

  return function ctLabelPosition(chart) {
    if (chart instanceof _chartist2['default'].Bar) {
      chart.on('draw', function (data) {
        if (data.type === 'label') {

          var labelDirection = data.axis.units.dir;

          if (!chart.options.horizontalBars && labelDirection === 'horizontal') {
            if (data.element._node.getComputedTextLength) {
              data.element._node.setAttribute('x', Math.floor(parseInt(data.element._node.getAttribute('x')) + (parseInt(data.element._node.getAttribute('width')) - data.element._node.getComputedTextLength()) / 2));
            }
          }

          if (chart.options.horizontalBars && labelDirection === 'vertical') {
            data.element._node.setAttribute('y', data.element._node.getAttribute('y') - data.element._node.getAttribute('height') / 2 + 15 / 4);
          }
        }
      });
    }
  };
}

;