define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctLabelPosition = ctLabelPosition;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function ctLabelPosition() {

    return function ctLabelPosition(chart) {
      if (chart instanceof _Chartist['default'].Bar) {
        chart.on('draw', function (data) {
          if (data.type === 'label') {

            var labelDirection = data.axis.units.dir;

            if (!chart.options.horizontalBars && labelDirection === 'horizontal' && data.element._node.getComputedTextLength) {
              data.element._node.setAttribute('x', Math.floor(parseInt(data.element._node.getAttribute('x')) + parseInt(data.element._node.getAttribute('width')) / 2));
              data.element._node.removeAttribute('width');
            }

            if (chart.options.horizontalBars && labelDirection === 'vertical') {
              data.element._node.setAttribute('y', Math.floor(data.element._node.getAttribute('y') - data.element._node.getAttribute('height') / 2 + 15 / 4));
            }
          }
        });
      }
    };
  }

  ;
});