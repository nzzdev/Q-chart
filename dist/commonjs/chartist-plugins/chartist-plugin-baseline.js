'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctBaseline = ctBaseline;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctBaseline() {
  return function ctBaseline(chart) {
    if (chart instanceof _chartist2['default'].Line || _chartist2['default'].Bar) {

      chart.on('draw', function (data) {
        try {
          if (data.type === 'grid') {
            var lineIndex = data.index;

            if (data.axis.ticks[lineIndex] === 0) {
              data.element.addClass('ct-baseline');
            }
          }
        } catch (e) {}
      });

      chart.on('created', function () {
        try {
          var baselineGroup = chart.svg.elem('g').addClass('ct-baseline-group');
          var baselineLine = chart.svg.querySelector('.ct-baseline');
          baselineGroup.append(baselineLine);
          chart.svg.append(baselineGroup);
        } catch (e) {}
      });
    }
  };
}

;